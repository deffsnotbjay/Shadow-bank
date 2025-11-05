"use client"

import { motion } from "framer-motion"
import { Wallet, Lock } from "lucide-react"
import { useEffect, useState } from "react"

interface DualBalanceCardProps {
  totalBalance: number
  availableBalance: number
  accountId: string
}

export function DualBalanceCard({ totalBalance, availableBalance, accountId }: DualBalanceCardProps) {
  const [displayTotal, setDisplayTotal] = useState(0)
  const [displayAvailable, setDisplayAvailable] = useState(0)

  useEffect(() => {
    let startTotal = 0
    const endTotal = totalBalance
    const duration = 1000
    const incrementTotal = endTotal / (duration / 16)

    const timerTotal = setInterval(() => {
      startTotal += incrementTotal
      if (startTotal >= endTotal) {
        setDisplayTotal(endTotal)
        clearInterval(timerTotal)
      } else {
        setDisplayTotal(Math.floor(startTotal))
      }
    }, 16)

    return () => clearInterval(timerTotal)
  }, [totalBalance])

  useEffect(() => {
    let startAvailable = 0
    const endAvailable = availableBalance
    const duration = 1000
    const incrementAvailable = endAvailable / (duration / 16)

    const timerAvailable = setInterval(() => {
      startAvailable += incrementAvailable
      if (startAvailable >= endAvailable) {
        setDisplayAvailable(endAvailable)
        clearInterval(timerAvailable)
      } else {
        setDisplayAvailable(Math.floor(startAvailable))
      }
    }, 16)

    return () => clearInterval(timerAvailable)
  }, [availableBalance])

  const pendingAmount = totalBalance - availableBalance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border border-blue-200/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-blue-900">Wallet Balance</h2>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Total Balance */}
        <div>
          <p className="text-sm text-blue-600 mb-2">Total Balance</p>
          <motion.div
            key={totalBalance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-blue-900"
          >
            ₦{displayTotal.toLocaleString()}
          </motion.div>
        </div>

        {/* Available Balance */}
        <div className="pt-4 border-t border-blue-200/30">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-600">Available Balance</p>
          </div>
          <motion.div
            key={availableBalance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-blue-700"
          >
            ₦{displayAvailable.toLocaleString()}
          </motion.div>
        </div>

        {/* Pending Amount */}
        {pendingAmount > 0 && (
          <div className="pt-4 border-t border-blue-200/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs text-amber-600">₦{pendingAmount.toLocaleString()} pending confirmation</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-blue-600 mt-6">{accountId}</p>
    </motion.div>
  )
}
