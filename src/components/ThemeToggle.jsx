import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
        theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'
      }`}
      title="Toggle Theme"
    >
      <motion.div
        className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        }`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          x: theme === 'dark' ? 24 : 0
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        >
          {theme === 'dark' ? (
            <Moon size={14} className="text-blue-400" />
          ) : (
            <Sun size={14} className="text-orange-400" />
          )}
        </motion.div>
      </motion.div>
    </button>
  )
}