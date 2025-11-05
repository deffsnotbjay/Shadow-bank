"use client"

import { useState, useEffect, useCallback } from "react"
import * as api from "@/lib/api"

export interface Transaction {
  id: string
  accountId: string
  amount: number
  status: "pending" | "posted" | "reversed"
  timestamp: string
}

export interface Transfer {
  id: string
  from: string
  to: string
  amount: number
  type: "TRANSFER"
  status: "pending" | "posted" | "reversed"
  timestamp: string
}

export interface Balance {
  total: number
  available: number
}

export interface ShadowData {
  transactions: Transaction[]
  balances: Record<string, Balance>
  transfers: Transfer[]
  notifications: Record<string, string[]>
}

const STORAGE_KEYS = {
  NOTIFICATIONS: "shadow_notifications",
  TRANSFERS: "shadow_transfers",
}

const INITIAL_DATA: ShadowData = {
  transactions: [],
  balances: {},
  transfers: [],
  notifications: {
    "acc-demo-1": [],
    "acc-demo-2": [],
  },
}

export function useShadowStorage() {
  const [data, setData] = useState<ShadowData>(INITIAL_DATA)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      // Fetch transactions from API
      const transactions = await api.getAllTransactions()

      // Fetch balances from API
      const balances = await api.getAllBalances()

      // Load transfers and notifications from localStorage (until we have API endpoints for these)
      const transfers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSFERS) || "[]")
      const notifications = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || JSON.stringify(INITIAL_DATA.notifications),
      )

      setData({ transactions, balances, transfers, notifications })
      setIsLoaded(true)
    } catch (error) {
      console.error("Failed to load data:", error)
      // Fall back to initial data on error
      setData(INITIAL_DATA)
      setIsLoaded(true)
    }
  }, [])

  // Initialize data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  const saveLocalData = useCallback((newData: ShadowData) => {
    // Save only local-only data to localStorage
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(newData.transfers))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newData.notifications))
    setData(newData)
  }, [])

  const createTransaction = useCallback(
    async (accountId: string, amount: number) => {
      try {
        // Create transaction via API
        const transaction = await api.createCredit(accountId, amount)

        // Update local state with notification
        const newData = {
          ...data,
          transactions: [...data.transactions, transaction],
          notifications: {
            ...data.notifications,
            [accountId]: [
              ...(data.notifications[accountId] || []),
              `₦${amount.toLocaleString()} deposit is being confirmed.`,
            ],
          },
        }

        saveLocalData(newData)

        // Reload data from API to get updated balances
        await loadData()

        return transaction
      } catch (error) {
        console.error("Failed to create transaction:", error)
        throw error
      }
    },
    [data, saveLocalData, loadData],
  )

  const postTransaction = useCallback(
    async (transactionId: string) => {
      try {
        // Post transaction via API
        const updatedTransaction = await api.postTransaction(transactionId)

        const transaction = data.transactions.find((t: Transaction) => t.id === transactionId)
        if (!transaction) return

        // Update local state with notification
        const newData = {
          ...data,
          transactions: data.transactions.map((t: Transaction) =>
            t.id === transactionId ? updatedTransaction : t
          ),
          notifications: {
            ...data.notifications,
            [transaction.accountId]: [
              ...(data.notifications[transaction.accountId] || []),
              `₦${transaction.amount.toLocaleString()} deposit is now available.`,
            ],
          },
        }

        saveLocalData(newData)

        // Reload data from API to get updated balances
        await loadData()
      } catch (error) {
        console.error("Failed to post transaction:", error)
        throw error
      }
    },
    [data, saveLocalData, loadData],
  )

  const reverseTransaction = useCallback(
    async (transactionId: string) => {
      try {
        // Reverse transaction via API
        const updatedTransaction = await api.reverseTransaction(transactionId)

        const transaction = data.transactions.find((t: Transaction) => t.id === transactionId)
        if (!transaction) return

        // Update local state with notification
        const newData = {
          ...data,
          transactions: data.transactions.map((t: Transaction) =>
            t.id === transactionId ? updatedTransaction : t
          ),
          notifications: {
            ...data.notifications,
            [transaction.accountId]: [
              ...(data.notifications[transaction.accountId] || []),
              `₦${transaction.amount.toLocaleString()} deposit was reversed.`,
            ],
          },
        }

        saveLocalData(newData)

        // Reload data from API to get updated balances
        await loadData()
      } catch (error) {
        console.error("Failed to reverse transaction:", error)
        throw error
      }
    },
    [data, saveLocalData, loadData],
  )

  const createPendingTransfer = useCallback(
    (from: string, to: string, amount: number) => {
      const fromBalance = data.balances[from] || { total: 0, available: 0 }

      // Check if user has enough available balance
      if (fromBalance.available < amount) {
        return { success: false, error: "Insufficient available balance" }
      }

      const transfer: Transfer = {
        id: `trf-${Date.now()}`,
        from,
        to,
        amount,
        type: "TRANSFER",
        status: "pending",
        timestamp: new Date().toISOString(),
      }

      const toBalance = data.balances[to] || { total: 0, available: 0 }

      const newData = {
        ...data,
        transfers: [...data.transfers, transfer],
        balances: {
          ...data.balances,
          [from]: {
            total: fromBalance.total - amount,
            available: fromBalance.available - amount,
          },
          [to]: toBalance, // Receiver balance unchanged until posted
        },
        notifications: {
          ...data.notifications,
          [from]: [
            ...(data.notifications[from] || []),
            `You sent ₦${amount.toLocaleString()} to ${to} (awaiting confirmation).`,
          ],
          [to]: [
            ...(data.notifications[to] || []),
            `₦${amount.toLocaleString()} from ${from} is being processed.`,
          ],
        },
      }

      saveLocalData(newData)
      return { success: true, transfer }
    },
    [data, saveLocalData],
  )

  const postTransfer = useCallback(
    (transferId: string) => {
      const transfer = data.transfers.find((t: Transfer) => t.id === transferId)
      if (!transfer) return

      const toBalance = data.balances[transfer.to] || { total: 0, available: 0 }

      const newData = {
        ...data,
        transfers: data.transfers.map((t: Transfer) => (t.id === transferId ? { ...t, status: "posted" as const } : t)),
        balances: {
          ...data.balances,
          [transfer.to]: {
            total: toBalance.total + transfer.amount,
            available: toBalance.available + transfer.amount,
          },
        },
        notifications: {
          ...data.notifications,
          [transfer.to]: [
            ...(data.notifications[transfer.to] || []),
            `₦${transfer.amount.toLocaleString()} from ${transfer.from} is now available.`,
          ],
        },
      }

      saveLocalData(newData)
    },
    [data, saveLocalData],
  )

  const reverseTransfer = useCallback(
    (transferId: string) => {
      const transfer = data.transfers.find((t: Transfer) => t.id === transferId)
      if (!transfer) return

      const fromBalance = data.balances[transfer.from] || { total: 0, available: 0 }

      const newData = {
        ...data,
        transfers: data.transfers.map((t: Transfer) => (t.id === transferId ? { ...t, status: "reversed" as const } : t)),
        balances: {
          ...data.balances,
          [transfer.from]: {
            total: fromBalance.total + transfer.amount,
            available: fromBalance.available + transfer.amount,
          },
        },
        notifications: {
          ...data.notifications,
          [transfer.from]: [
            ...(data.notifications[transfer.from] || []),
            `₦${transfer.amount.toLocaleString()} transfer to ${transfer.to} was reversed.`,
          ],
          [transfer.to]: [
            ...(data.notifications[transfer.to] || []),
            `₦${transfer.amount.toLocaleString()} from ${transfer.from} failed or was reversed.`,
          ],
        },
      }

      saveLocalData(newData)
    },
    [data, saveLocalData],
  )

  const createTransfer = useCallback(
    (from: string, to: string, amount: number) => {
      const fromBalance = data.balances[from] || { total: 0, available: 0 }

      if (fromBalance.available < amount) {
        return { success: false, error: "You can't send shadow funds until they're confirmed." }
      }

      const transfer: Transfer = {
        id: `trf-${Date.now()}`,
        from,
        to,
        amount,
        type: "TRANSFER",
        status: "posted",
        timestamp: new Date().toISOString(),
      }

      const toBalance = data.balances[to] || { total: 0, available: 0 }

      const newData = {
        ...data,
        transfers: [...data.transfers, transfer],
        balances: {
          ...data.balances,
          [from]: {
            total: fromBalance.total - amount,
            available: fromBalance.available - amount,
          },
          [to]: {
            total: toBalance.total + amount,
            available: toBalance.available + amount,
          },
        },
        notifications: {
          ...data.notifications,
          [from]: [
            ...(data.notifications[from] || []),
            `You sent ₦${amount.toLocaleString()} to ${to}.`,
          ],
          [to]: [
            ...(data.notifications[to] || []),
            `You received ₦${amount.toLocaleString()} from ${from}.`,
          ],
        },
      }

      saveLocalData(newData)
      return { success: true }
    },
    [data, saveLocalData],
  )

  return {
    data,
    isLoaded,
    createTransaction,
    postTransaction,
    reverseTransaction,
    createTransfer,
    createPendingTransfer,
    postTransfer,
    reverseTransfer,
  }
}
