import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children, session }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-red-500/30 overflow-x-hidden relative transition-colors duration-300">
      
      
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300">
     
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px]" />
         
       
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 mix-blend-overlay"></div>
      </div>

   
      <Navbar session={session} />

     
      <div className="relative z-10 max-w-[1800px] mx-auto p-6 pb-20">
        {children}
      </div>

    </div>
  )
}