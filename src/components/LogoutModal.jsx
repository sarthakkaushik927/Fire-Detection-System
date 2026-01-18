import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, LogOut, X } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl shadow-red-900/20 overflow-hidden"
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />

            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50 text-red-500">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
                Terminate Session?
              </h3>
              
              <p className="text-slate-400 text-xs font-mono mb-8 leading-relaxed">
                You are about to disconnect from the Command Network. Re-authentication will be required to access drone controls.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onClose}
                  className="py-3 rounded-xl bg-slate-800 text-slate-300 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={14} /> Cancel
                </button>
                
                <button 
                  onClick={onConfirm}
                  className="py-3 rounded-xl bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
                >
                  <LogOut size={14} /> Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}