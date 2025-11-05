"use client"

import { motion } from "framer-motion"
import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-12 border border-blue-200/50 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center"
      >
        <Inbox className="w-8 h-8 text-blue-500" />
      </motion.div>
      <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-blue-600">{description}</p>
    </motion.div>
  )
}
