"use client"

import type { Transfer } from "@/hooks/use-shadow-storage"
import { motion } from "framer-motion"
import { Send, ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface TransfersListProps {
  transfers: Transfer[]
  accountId: string
}

export function TransfersList({ transfers, accountId }: TransfersListProps) {
  const userTransfers = transfers.filter((t) => t.from === accountId || t.to === accountId)

  if (userTransfers.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-blue-200/50 text-center">
        <Send className="w-12 h-12 text-blue-300 mx-auto mb-4" />
        <p className="text-blue-600">No transfers yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userTransfers.map((transfer, idx) => {
        const isSent = transfer.from === accountId
        return (
          <motion.div
            key={transfer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-xl p-4 border border-blue-200/50 flex items-center justify-between hover:border-blue-300/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSent ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {isSent ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-blue-900">
                  {isSent ? `Sent to ${transfer.to}` : `Received from ${transfer.from}`}
                </p>
                <p className="text-xs text-blue-600">
                  {new Date(transfer.timestamp).toLocaleDateString()} at{" "}
                  {new Date(transfer.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <p className={`text-lg font-bold ${isSent ? "text-red-600" : "text-green-600"}`}>
              {isSent ? "-" : "+"}₦{transfer.amount.toLocaleString()}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
