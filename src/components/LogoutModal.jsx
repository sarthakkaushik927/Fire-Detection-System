import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, LogOut, ShieldCheck } from 'lucide-react'

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  
  // 🟢 REUSABLE LIQUID BUTTON (Mini Version for Modal)
  const ModalButton = ({ children, onClick, variant = "primary" }) => {
    const isPrimary = variant === "primary"
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, boxShadow: isPrimary ? "0 0 20px rgba(220, 38, 38, 0.4)" : "0 0 20px rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2
          transition-all duration-300 border
          ${isPrimary 
            ? "border-red-500/50 text-white shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]" 
            : "border-white/10 text-slate-300 hover:text-white hover:bg-white/5"}
        `}
        style={{
          background: isPrimary 
            ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(153, 27, 27, 0.3))"
            : "transparent"
        }}
      >
        {isPrimary && (
             <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full hover:animate-[shimmer_1s_infinite]" />
             </div>
        )}
        {children}
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          
          {/* 🟢 BACKDROP (Dark Blur) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md cursor-pointer"
          />

          {/* 🟢 MODAL CONTENT (Liquid Glass Box) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#0a0a0a]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Top Red Warning Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            
            <div className="p-8 text-center relative z-10">
              
              {/* ICON GLOW */}
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <AlertTriangle className="text-red-500 animate-pulse" size={32} />
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                Terminate Session?
              </h2>
              
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-mono">
                WARNING: This will disconnect your secure uplink to the FireWatch Command Center. Unsaved data may be lost.
              </p>

              <div className="flex flex-col gap-3">
                <ModalButton onClick={onConfirm} variant="primary">
                  <LogOut size={16} /> Confirm Termination
                </ModalButton>
                
                <ModalButton onClick={onClose} variant="secondary">
                  <ShieldCheck size={16} /> Cancel (Stay Secure)
                </ModalButton>
              </div>
            </div>

            {/* Background Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            
            {/* Corner Accents */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl" />

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}