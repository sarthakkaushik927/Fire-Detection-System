import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ShieldAlert, Cpu, Globe, ArrowRight, Zap, Flame, 
  Target, Activity, CheckCircle2, ChevronDown, Plane,
  FileWarning, Lock, Megaphone
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])

  // --- CUSTOM CURSOR LOGIC ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", mouseMove)
    return () => window.removeEventListener("mousemove", mouseMove)
  }, [])

  const textEnter = () => setCursorVariant("text")
  const textLeave = () => setCursorVariant("default")

  const cursorVariants = {
    default: { x: mousePos.x - 16, y: mousePos.y - 16, height: 32, width: 32, backgroundColor: "transparent", border: "2px solid #ef4444" },
    text: { x: mousePos.x - 40, y: mousePos.y - 40, height: 80, width: 80, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "2px solid #ef4444", mixBlendMode: "screen" }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden cursor-none selection:bg-red-500/30">
      
      {/* 🖱️ CUSTOM CURSOR (Hidden on mobile) */}
      <motion.div 
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:flex items-center justify-center"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      </motion.div>

      {/* 🟢 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            className="flex items-center gap-2 cursor-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ShieldAlert className="text-red-600" size={28} />
            <span className="text-xl font-black tracking-tighter italic">FIREWATCH <span className="text-red-600">PRO</span></span>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Registry Link */}
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              onClick={() => navigate('/registry')}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-none"
            >
              <FileWarning size={16} /> Report Hazard
            </button>

            {/* Admin Link */}
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              onClick={() => navigate('/auth')}
              className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 cursor-none flex items-center gap-2"
            >
              <Lock size={14} /> Command Center
            </button>
          </div>
        </div>
      </nav>

      {/* 🎬 HERO SECTION */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Parallax Background */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2074&auto=format&fit=crop" 
            alt="Forest Fire" 
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-red-600/10 border border-red-500/50 rounded-full px-4 py-1 mb-8">
              <span className="text-red-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> AI-Powered Defense Matrix
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
              Predict. Detect. <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient">Neutralize.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              The world's most advanced wildfire command center. Utilizing NASA satellite arrays and autonomous drone swarms to stop fires before they begin.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onMouseEnter={textEnter} onMouseLeave={textLeave}
                onClick={() => navigate('/auth')}
                className="bg-red-600 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-red-700 transition shadow-[0_0_40px_rgba(220,38,38,0.4)] group cursor-none"
              >
                Launch Command Center
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onMouseEnter={textEnter} onMouseLeave={textLeave}
                onClick={() => navigate('/registry')}
                className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition cursor-none flex items-center gap-2"
              >
                Report Incident <FileWarning size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
           style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-8 flex flex-col items-center gap-2 text-slate-500"
        >
           <span className="text-[10px] uppercase tracking-widest">Scroll to Initiate</span>
           <ChevronDown className="animate-bounce" />
        </motion.div>
      </header>

      {/* 🟠 THE ORANGE HEADLINE TICKER (ADDED BACK) */}
      <div className="relative z-40 block w-full bg-orange-600 border-y border-orange-400/50 shadow-[0_0_50px_rgba(234,88,12,0.4)]">
        <div className="py-4 flex overflow-hidden">
          <motion.div 
            className="flex gap-24 whitespace-nowrap text-white font-mono font-black uppercase text-base tracking-[0.2em]"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...Array(15)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-4"><Target size={20}/> SECTOR_SCAN: ACTIVE</span>
                <span className="flex items-center gap-4"><Zap size={20}/> UPLINK: STABLE</span>
                <span className="flex items-center gap-4 text-yellow-300"><Flame size={20}/> THREAT_LEVEL: NOMINAL</span>
                <span className="opacity-40 font-light mx-4">||</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 🛠️ TACTICAL WORKFLOW (Three Boxes Section: Satellite -> AI -> Drone) */}
      <section className="py-32 px-6 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Tactical Workflow</h2>
            <p className="text-slate-400 max-w-xl mx-auto">From satellite detection to ground suppression in under 5 minutes.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Dashed line connecting the boxes) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-slate-800 via-red-900 to-slate-800 -z-10"></div>
            
            <StepCard 
              step="01" 
              title="Satellite Detection" 
              desc="NASA VIIRS & MODIS satellites identify thermal anomalies from orbit instantly."
              icon={<Globe size={32} className="text-blue-400" />}
              trigger={textEnter} leave={textLeave}
            />
            <StepCard 
              step="02" 
              title="AI Analysis" 
              desc="Our neural engine filters false positives and predicts fire spread vectors."
              icon={<Cpu size={32} className="text-purple-400" />}
              trigger={textEnter} leave={textLeave}
            />
            <StepCard 
              step="03" 
              title="Drone Deployment" 
              desc="Autonomous quadcopters dispatch to coordinates to verify and suppress."
              icon={<Plane size={32} className="text-red-400" />}
              trigger={textEnter} leave={textLeave}
            />
          </div>
        </div>
      </section>

      {/* 🧱 FEATURES GRID */}
      <section className="py-24 px-6 bg-slate-900 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
             <img 
               src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000&auto=format&fit=crop" 
               alt="Drone Tech" 
               className="relative z-10 rounded-3xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition duration-500"
             />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
             <h2 className="text-4xl font-black mb-6">YOLOv8 Computer Vision</h2>
             <p className="text-slate-400 text-lg mb-8 leading-relaxed">
               We don't just see smoke; we understand it. Our proprietary computer vision models run on-edge devices, detecting fire signatures with 99.8% accuracy even in thick haze.
             </p>
             <div className="space-y-4">
               <FeatureItem text="Sub-second inference time" />
               <FeatureItem text="Thermal & RGB fusion analysis" />
               <FeatureItem text="Autonomous flight pathing" />
             </div>
             <button 
                onMouseEnter={textEnter} onMouseLeave={textLeave}
                className="mt-10 text-red-500 font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-none"
             >
                Read the Whitepaper <ArrowRight size={18}/>
             </button>
          </motion.div>
        </div>
      </section>

      {/* ⚠️ COMPLAINT REGISTRY SECTION */}
      <section className="py-24 px-6 bg-gradient-to-r from-orange-900/20 to-slate-950 border-b border-white/5 relative">
        <div className="max-w-5xl mx-auto text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }}
                className="bg-slate-900/50 p-12 rounded-[3rem] border border-orange-500/30 backdrop-blur-sm"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 mb-6">
                    <Megaphone size={32} />
                </div>
                <h2 className="text-4xl font-black mb-4">Civilian Reporting Protocol</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
                    Witnessing potential hazards? Use the public registry to report unauthorized burns, smoke sightings, or debris buildup. Your reports feed directly into our AI analysis engine.
                </p>
                <button 
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                    onClick={() => navigate('/registry')}
                    className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-3 mx-auto cursor-none"
                >
                    <FileWarning size={18} /> Open Registry
                </button>
            </motion.div>
        </div>
      </section>

      {/* 🌍 GLOBAL IMPACT (Stats) */}
      <section className="py-32 px-6 bg-slate-950 text-center">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-[0.2em] mb-12">System Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <StatBox number="14,200" label="Fires Detected" />
               <StatBox number="850km²" label="Forest Protected" />
               <StatBox number="4.2s" label="Avg Response Time" />
               <StatBox number="100%" label="System Uptime" />
            </div>
         </div>
      </section>

      {/* 🚀 ADMIN FOOTER */}
      <footer className="py-32 px-6 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden text-center border-t border-red-900/30">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8 flex justify-center">
             <ShieldAlert size={64} className="text-red-600 opacity-50" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">Authorized Access</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-lg mx-auto">
            Restricted area. Command center login for active FireWatch operatives and system administrators only.
          </p>
          <button 
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            onClick={() => navigate('/auth')}
            className="bg-white text-black px-12 py-6 rounded-full font-black text-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-2xl cursor-none flex items-center gap-3 mx-auto"
          >
            <Lock size={20} /> INITIALIZE ADMIN
          </button>
        </div>
        <div className="mt-24 text-slate-600 text-sm font-mono">
           © 2024 FIREWATCH PRO. CLASSIFIED SYSTEMS. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function StepCard({ step, title, desc, icon, trigger, leave }) {
  return (
    <motion.div 
      onMouseEnter={trigger} onMouseLeave={leave}
      whileHover={{ y: -10 }}
      className="bg-slate-900 p-8 rounded-3xl border border-white/10 relative z-10 hover:border-red-500/50 transition-colors group cursor-none"
    >
      <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/5 transition-colors">
        {icon}
      </div>
      <div className="absolute top-8 right-8 text-6xl font-black text-white/5 select-none">{step}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
       <div className="bg-green-500/20 p-1 rounded-full">
         <CheckCircle2 size={16} className="text-green-500" />
       </div>
       <span className="font-bold text-slate-300">{text}</span>
    </div>
  )
}

function StatBox({ number, label }) {
  return (
    <div className="p-6 border-r border-white/5 last:border-0">
       <div className="text-4xl md:text-5xl font-black text-white mb-2">{number}</div>
       <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  )
}