"use client"

import { useShadowStorage } from "@/hooks/use-shadow-storage"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TransactionCard } from "@/components/transaction-card"
import { TransferCard } from "@/components/transfer-card"
import { EmptyState } from "@/components/empty-state"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"

export default function TransactionsPage() {
  const { data, isLoaded, postTransaction, reverseTransaction, postTransfer, reverseTransfer } = useShadowStorage()

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const allItems = [
    ...data.transactions.map((t) => ({ ...t, itemType: "transaction" as const })),
    ...data.transfers.map((t) => ({ ...t, itemType: "transfer" as const })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const stats = {
    totalTransactions: data.transactions.length,
    totalTransfers: data.transfers.length,
    pendingCount: allItems.filter((item) => item.status === "pending").length,
    postedCount: allItems.filter((item) => item.status === "posted").length,
    reversedCount: allItems.filter((item) => item.status === "reversed").length,
    totalVolume: allItems.filter((item) => item.status === "posted").reduce((sum, item) => sum + item.amount, 0),
    pendingVolume: allItems.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0),
  }

  const handlePostTransaction = async (transactionId: string) => {
    try {
      await postTransaction(transactionId)
      toast.success("Transaction posted successfully")
    } catch (error) {
      toast.error("Failed to post transaction")
      console.error("Post transaction error:", error)
    }
  }

  const handleReverseTransaction = async (transactionId: string) => {
    try {
      await reverseTransaction(transactionId)
      toast.success("Transaction reversed successfully")
    } catch (error) {
      toast.error("Failed to reverse transaction")
      console.error("Reverse transaction error:", error)
    }
  }

  const handlePostTransfer = (transferId: string) => {
    postTransfer(transferId)
    toast.success("Transfer posted successfully")
  }

  const handleReverseTransfer = (transferId: string) => {
    reverseTransfer(transferId)
    toast.success("Transfer reversed successfully")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="admin" />

      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Transaction Overview</h1>
          <p className="text-blue-600">Manage and monitor all transactions and transfers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-600">Total Items</p>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{allItems.length}</p>
            <p className="text-xs text-blue-500 mt-2">
              {stats.totalTransactions} transactions, {stats.totalTransfers} transfers
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-6 border border-amber-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-amber-600">Pending</p>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-amber-900">{stats.pendingCount}</p>
            <p className="text-xs text-amber-600 mt-2">₦{stats.pendingVolume.toLocaleString()}</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-6 border border-green-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-600">Posted</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.postedCount}</p>
            <p className="text-xs text-green-600 mt-2">₦{stats.totalVolume.toLocaleString()}</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-6 border border-red-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-red-600">Reversed</p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-900">{stats.reversedCount}</p>
            <p className="text-xs text-red-600 mt-2">Cancelled items</p>
          </motion.div>
        </motion.div>

        {allItems.length === 0 ? (
          <EmptyState title="No Transactions" description="Create a transaction to get started" />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4">All Items</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {allItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {item.itemType === "transaction" ? (
                    <TransactionCard
                      transaction={item as any}
                      onPost={() => handlePostTransaction(item.id)}
                      onReverse={() => handleReverseTransaction(item.id)}
                      isAdmin={true}
                    />
                  ) : (
                    <TransferCard
                      transfer={item as any}
                      onPost={() => handlePostTransfer(item.id)}
                      onReverse={() => handleReverseTransfer(item.id)}
                      isAdmin={true}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
