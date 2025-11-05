"use client"

import type React from "react"

import { useShadowStorage } from "@/hooks/use-shadow-storage"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function TransferPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id as string
  const { data, isLoaded, createPendingTransfer } = useShadowStorage()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const currentBalance = data.balances[accountId] || { total: 0, available: 0 }
  const availableAccounts = Object.keys(data.balances).filter((acc) => acc !== accountId)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipient) {
      toast.error("Please select a recipient")
      return
    }

    const transferAmount = Number.parseInt(amount)
    if (!transferAmount || transferAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsLoading(true)

    const result = createPendingTransfer(accountId, recipient, transferAmount)

    if (result.success) {
      toast.success("Transfer sent! Awaiting admin confirmation.")
      setRecipient("")
      setAmount("")
      setTimeout(() => router.push(`/user/${accountId}`), 1500)
    } else {
      toast.error(result.error || "Transfer failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="user" accountId={accountId} />

      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Send Money</h1>
          <p className="text-blue-600">Transfer funds to another account</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 border border-blue-200/50 mb-8"
          >
            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-blue-900">₦{currentBalance.available.toLocaleString()}</p>
              {currentBalance.total > currentBalance.available && (
                <p className="text-xs text-amber-600 mt-2">
                  💡 ₦{(currentBalance.total - currentBalance.available).toLocaleString()} pending confirmation
                </p>
              )}
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
              {/* Recipient */}
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">Send To</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select recipient...</option>
                  {availableAccounts.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={currentBalance.available}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !recipient || !amount}
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Send <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-blue-100 text-blue-900 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
          >
            Back
          </motion.button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
