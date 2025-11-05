"use client"

import { useShadowStorage } from "@/hooks/use-shadow-storage"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const { data, isLoaded } = useShadowStorage()

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const stats = [
    {
      label: "Total Transactions",
      value: data.transactions.length,
      icon: TrendingUp,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Pending",
      value: data.transactions.filter((t) => t.status === "pending").length,
      icon: Clock,
      color: "from-amber-400 to-amber-600",
    },
    {
      label: "Posted",
      value: data.transactions.filter((t) => t.status === "posted").length,
      icon: CheckCircle,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Reversed",
      value: data.transactions.filter((t) => t.status === "reversed").length,
      icon: XCircle,
      color: "from-red-400 to-red-600",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="admin" />

      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-blue-600">Manage transactions and monitor system activity</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-2xl p-6 border border-blue-200/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-blue-600">{stat.label}</p>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-blue-200/50"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create New Transaction
              </motion.button>
            </a>
            <a href="/admin/transactions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 rounded-xl font-semibold hover:shadow-lg transition-all border border-blue-200"
              >
                View All Transactions
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
