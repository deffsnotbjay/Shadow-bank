"use client"

import { useShadowStorage } from "@/hooks/use-shadow-storage"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DualBalanceCard } from "@/components/dual-balance-card"
import { NotificationPanel } from "@/components/notification-panel"
import { TransactionCard } from "@/components/transaction-card"
import { TransferCard } from "@/components/transfer-card"
import { EmptyState } from "@/components/empty-state"
import { motion } from "framer-motion"
import { RefreshCw, Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function UserDashboard() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id as string
  const { data, isLoaded } = useShadowStorage()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"credits" | "transfers">("credits")

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const balance = data.balances[accountId] || { total: 0, available: 0 }
  const notifications = data.notifications[accountId] || []
  const userTransactions = data.transactions.filter((t) => t.accountId === accountId)

  const postedIncomingTransfers = data.transfers.filter((t) => t.to === accountId && t.status === "posted")
  const allCredits = [
    ...userTransactions.map((t) => ({ ...t, type: "transaction" as const })),
    ...postedIncomingTransfers.map((t) => ({ ...t, type: "transfer" as const })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const pendingIncomingTransfers = data.transfers.filter((t) => t.to === accountId && t.status === "pending")
  const userOutgoingTransfers = data.transfers.filter((t) => t.from === accountId)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="user" accountId={accountId} />

      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome Back</h1>
            <p className="text-blue-600">Your account overview and recent activity</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationPanel notifications={notifications} accountId={accountId} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className={`w-6 h-6 ${isRefreshing ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <DualBalanceCard totalBalance={balance.total} availableBalance={balance.available} accountId={accountId} />
        </motion.div>

        {pendingIncomingTransfers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <p className="text-sm font-semibold text-amber-900 mb-3">Pending Deposits</p>
            <div className="space-y-2">
              {pendingIncomingTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
                >
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      ₦{transfer.amount.toLocaleString()} from {transfer.from}
                    </p>
                    <p className="text-xs text-amber-600">Awaiting admin confirmation</p>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-amber-100 rounded-full">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-amber-900">Processing</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/user/${accountId}/transfer`)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send Money
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex gap-4 mb-6 border-b border-blue-200">
            <button
              onClick={() => setActiveTab("credits")}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === "credits"
                  ? "text-blue-900 border-b-2 border-blue-600"
                  : "text-blue-600 hover:text-blue-900"
              }`}
            >
              Credits
            </button>
            <button
              onClick={() => setActiveTab("transfers")}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === "transfers"
                  ? "text-blue-900 border-b-2 border-blue-600"
                  : "text-blue-600 hover:text-blue-900"
              }`}
            >
              Transfers
            </button>
          </div>

          {activeTab === "credits" ? (
            <>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Recent Credits</h2>
              {allCredits.length === 0 ? (
                <EmptyState title="No Credits" description="Your credits will appear here" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCredits.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {item.type === "transaction" ? (
                        <TransactionCard transaction={item as any} isAdmin={false} />
                      ) : (
                        <TransferCard transfer={item as any} isAdmin={false} />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">My Transfers</h2>
              {userOutgoingTransfers.length === 0 ? (
                <EmptyState title="No Transfers" description="Your sent transfers will appear here" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userOutgoingTransfers.map((transfer, idx) => (
                    <motion.div
                      key={transfer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <TransferCard transfer={transfer} isAdmin={false} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
