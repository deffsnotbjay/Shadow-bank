"use client"

import type React from "react"

import { useState } from "react"
import { useShadowStorage } from "@/hooks/use-shadow-storage"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { ArrowRight } from "lucide-react"

export default function CreateTransaction() {
  const { createTransaction, isLoaded } = useShadowStorage()
  const [accountId, setAccountId] = useState("acc-demo-1")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    try {
      await createTransaction(accountId, Number(amount))
      toast.success(`Transaction created for ${accountId}`)
      setAmount("")
    } catch (error) {
      toast.error("Failed to create transaction")
      console.error("Transaction creation error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="admin" />

      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Create Transaction</h1>
          <p className="text-blue-600">Create a new credit transaction for a user account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl glass rounded-2xl p-8 border border-blue-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-3">Account ID</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="acc-demo-1">acc-demo-1</option>
                <option value="acc-demo-2">acc-demo-2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-3">Amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                min="1"
                step="100"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Transaction"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
