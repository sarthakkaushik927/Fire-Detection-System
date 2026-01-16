import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, Cpu, Globe, Users, ArrowRight, Zap, Flame } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* 🟢 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={28} />
            <span className="text-xl font-black tracking-tighter italic">FIREWATCH <span className="text-red-500">PRO</span></span>
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
          >
            Access Dashboard
          </button>
        </div>
      </nav>

      {/* 🔥 HERO SECTION */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2074&auto=format&fit=crop" 
            alt="Forest Fire" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-block bg-red-500/20 border border-red-500/50 rounded-full px-4 py-1 mb-6">
              <span className="text-red-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> AI-Powered Defense
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Predict. Detect. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Neutralize.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              The world's most advanced wildfire command center. Combining NASA satellite data with autonomous drone surveillance to stop fires before they spread.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 mx-auto hover:bg-red-700 transition shadow-lg shadow-red-900/50 group"
            >
              Launch Command Center
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* 🛸 FEATURES GRID */}
      <section className="py-24 px-6 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-black mb-4">Autonomous Intelligence</h2>
            <p className="text-slate-400">Integrated systems working in harmony.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <FeatureCard 
              icon={<Globe className="text-blue-400" size={40} />}
              title="NASA Satellite Link"
              desc="Real-time thermal anomaly detection using VIIRS & MODIS satellite constellations."
              img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
            />
            {/* Feature 2 */}
            <FeatureCard 
              icon={<Cpu className="text-orange-400" size={40} />}
              title="YOLOv8 AI Vision"
              desc="Computer vision algorithms process drone feeds instantly to identify smoke and flames."
              img="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000&auto=format&fit=crop"
            />
            {/* Feature 3 */}
            <FeatureCard 
              icon={<Zap className="text-yellow-400" size={40} />}
              title="Drone Swarm"
              desc="Rapid response UAVs deployed automatically to verify satellite hotspots."
              img="https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* 👥 TEAM SECTION */}
      <section className="py-24 px-6 bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
             initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
             className="text-4xl font-black mb-16 text-center"
          >
            Engineered by The Best
          </motion.h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <TeamMember name="Alex Chen" role="AI Architect" />
            <TeamMember name="Sarah Jones" role="Drone Specialist" />
            <TeamMember name="David Kim" role="Frontend Lead" />
            <TeamMember name="Maria Garcia" role="Backend Engineer" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
        <p>© 2024 FireWatch Pro. Protecting the future.</p>
      </footer>
    </div>
  )
}

// Helper Components
function FeatureCard({ icon, title, desc, img }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 group"
    >
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="p-8 relative z-20 -mt-12">
        <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function TeamMember({ name, role }) {
  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center hover:border-red-500/30 transition-colors">
      <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="text-slate-600" />
      </div>
      <h4 className="font-bold text-lg text-white">{name}</h4>
      <p className="text-red-500 text-sm font-bold uppercase tracking-wider">{role}</p>
    </div>
  )
}