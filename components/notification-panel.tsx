"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { useState, useEffect } from "react"

interface NotificationPanelProps {
  notifications: string[]
  accountId: string
}

export function NotificationPanel({ notifications, accountId }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayNotifications, setDisplayNotifications] = useState(notifications)

  useEffect(() => {
    setDisplayNotifications(notifications)
  }, [notifications])

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {displayNotifications.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {displayNotifications.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 glass rounded-2xl border border-blue-200/50 shadow-2xl z-50"
          >
            <div className="p-4 border-b border-blue-200/50 flex items-center justify-between">
              <h3 className="font-bold text-blue-900">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {displayNotifications.length === 0 ? (
                <div className="p-6 text-center text-blue-600">
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-blue-200/50">
                  {displayNotifications.map((notification, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 hover:bg-blue-50/50 transition-colors"
                    >
                      <p className="text-sm text-blue-900">{notification}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
