"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="border-t border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100 py-6 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-blue-600">SHADOW © 2025 — Simulated Banking Core</p>
      </div>
    </motion.footer>
  )
}
