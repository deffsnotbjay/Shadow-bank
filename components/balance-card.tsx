"use client"

import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { useEffect, useState } from "react"

interface BalanceCardProps {
  balance: number
  accountId: string
}

export function BalanceCard({ balance, accountId }: BalanceCardProps) {
  const [displayBalance, setDisplayBalance] = useState(0)

  useEffect(() => {
    let start = 0
    const end = balance
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayBalance(end)
        clearInterval(timer)
      } else {
        setDisplayBalance(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [balance])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border border-blue-200/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-blue-900">Wallet Balance</h2>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
      </div>

      <motion.div
        key={balance}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-5xl font-bold text-blue-900 mb-2"
      >
        ₦{displayBalance.toLocaleString()}
      </motion.div>

      <p className="text-sm text-blue-600">{accountId}</p>
    </motion.div>
  )
}
