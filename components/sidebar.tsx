"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Plus, List, Users } from "lucide-react"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/create", label: "Create Transaction", icon: Plus },
  { href: "/admin/transactions", label: "All Transactions", icon: List },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass w-64 min-h-screen border-r border-blue-200/50 p-6"
    >
      <div className="space-y-2">
        {adminLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-blue-500 text-white shadow-lg" : "text-blue-900 hover:bg-blue-100/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 pt-6 border-t border-blue-200/50">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-4">Quick Access</p>
        <div className="space-y-2">
          <Link href="/user/acc-demo-1">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-900 hover:bg-blue-100/50 transition-all"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">View User 1</span>
            </motion.div>
          </Link>
          <Link href="/user/acc-demo-2">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-900 hover:bg-blue-100/50 transition-all"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">View User 2</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.aside>
  )
}
