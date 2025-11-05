"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface NavbarProps {
  userRole: "admin" | "user"
  accountId?: string
}

export function Navbar({ userRole, accountId }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-50 border-b border-blue-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900">SHADOW</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-900 font-semibold text-sm">
            {userRole === "admin" ? "Admin Dashboard" : `User: ${accountId}`}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
