"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Transfer } from "@/hooks/use-shadow-storage"

interface TransferCardProps {
  transfer: Transfer
  onPost?: () => void
  onReverse?: () => void
  isAdmin?: boolean
}

export function TransferCard({ transfer, onPost, onReverse, isAdmin = false }: TransferCardProps) {
  const statusConfig = {
    pending: { color: "bg-amber-100", textColor: "text-amber-900", icon: Clock, label: "Pending" },
    posted: { color: "bg-blue-100", textColor: "text-blue-900", icon: CheckCircle, label: "Posted" },
    reversed: { color: "bg-red-100", textColor: "text-red-900", icon: XCircle, label: "Reversed" },
  }

  const config = statusConfig[transfer.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`glass rounded-2xl p-6 border border-blue-200/50 hover:shadow-xl transition-all ${
        transfer.status === "pending" ? "shadow-pulse" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">
              {transfer.from} → {transfer.to}
            </p>
            <p className="text-xs text-blue-500">{new Date(transfer.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}>
          <StatusIcon className={`w-4 h-4 ${config.textColor}`} />
          <span className={`text-xs font-semibold ${config.textColor}`}>{config.label}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-blue-900">₦{transfer.amount.toLocaleString()}</p>
        <p className="text-xs text-blue-500 mt-1">Type: {transfer.type}</p>
      </div>

      {isAdmin && transfer.status !== "reversed" && (
        <div className="flex gap-2">
          {transfer.status === "pending" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPost}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Post
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReverse}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Reverse
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
