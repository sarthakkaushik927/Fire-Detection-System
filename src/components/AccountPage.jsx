import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Phone, MapPin, Briefcase, Activity, 
  Save, X, Award, Terminal, TrendingUp, Mail 
} from 'lucide-react'
import { supabase } from '../Supabase/supabase'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PERF_DATA = [
  { name: 'Jan', success: 40 }, { name: 'Feb', success: 65 },
  { name: 'Mar', success: 50 }, { name: 'Apr', success: 85 },
  { name: 'May', success: 75 }, { name: 'Jun', success: 95 },
]

export default function AccountPage({ session }) {
  const [user, setUser] = useState(session.user)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user.user_metadata?.full_name || '',
    phone: user.user_metadata?.phone || '',
    org: user.user_metadata?.org || 'FireWatch HQ',
    location: user.user_metadata?.location || 'Unknown',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({ data: formData })
      if (error) throw error
      setUser(data.user)
      setIsEditing(false)
      alert("✅ Profile updated successfully")
    } catch (error) {
      alert(`Update Failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      {/* LEFT COLUMN */}
      <div className="md:col-span-4 space-y-8">
        
        {/* Identity Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 text-center relative overflow-hidden shadow-xl transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
          <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
             <img src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=0f172a&color=fff`} className="w-full h-full rounded-full object-cover" alt="Profile"/>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{formData.full_name || 'Operator'}</h2>
          <p className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6">Level 4 Commander</p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
             <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-xl transition-colors">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Clearance</p>
                <p className="text-slate-900 dark:text-white font-mono font-bold">ALPHA-1</p>
             </div>
             <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-xl transition-colors">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                <p className="text-green-500 font-mono font-bold">ACTIVE</p>
             </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 shadow-lg transition-colors duration-300">
           <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <Award size={18} className="text-yellow-500"/> Certifications
           </h3>
           <div className="space-y-4">
              <SkillBar label="Drone Piloting" level="98%" color="bg-blue-500" />
              <SkillBar label="Crisis Management" level="85%" color="bg-orange-500" />
              <SkillBar label="AI Systems" level="92%" color="bg-purple-500" />
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-8 space-y-8">
        
        {/* Edit Details */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 shadow-lg transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <User size={20} className="text-red-500"/> Operative Data
                </h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-xs font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-slate-600 dark:text-white">Edit Profile</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full"><X size={16}/></button>
                    <button onClick={handleSave} className="p-2 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full">
                      {loading ? <Activity className="animate-spin" size={16}/> : <Save size={16}/>}
                    </button>
                  </div>
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <InfoField icon={<User size={16}/>} label="Full Name" value={formData.full_name} isEditing={isEditing} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                <InfoField icon={<Phone size={16}/>} label="Direct Line" value={formData.phone} isEditing={isEditing} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <InfoField icon={<Briefcase size={16}/>} label="Unit / Org" value={formData.org} isEditing={isEditing} onChange={(e) => setFormData({...formData, org: e.target.value})} />
                <InfoField icon={<MapPin size={16}/>} label="Stationed At" value={formData.location} isEditing={isEditing} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 shadow-lg transition-colors duration-300">
           <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <TrendingUp size={18} className="text-green-500"/> Mission Success Rate
           </h3>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={PERF_DATA}>
                    <defs>
                       <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} />
                    <Tooltip contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155', borderRadius:'10px'}} itemStyle={{color:'#22c55e'}} />
                    <Area type="monotone" dataKey="success" stroke="#22c55e" fillOpacity={1} fill="url(#colorSuccess)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Terminal Log (Always Dark) */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 font-mono text-xs shadow-inner">
           <div className="flex items-center gap-2 text-slate-500 mb-4 pb-2 border-b border-slate-800">
              <Terminal size={14} /> SYSTEM_LOGS.txt
           </div>
           <div className="space-y-2 text-slate-400 h-32 overflow-y-auto">
              <p><span className="text-green-500">[SUCCESS]</span> Profile metadata write operation completed.</p>
              <p><span className="text-blue-500">[INFO]</span> Connected to Satellite Uplink (VIIRS_SNPP).</p>
              <p><span className="text-yellow-500">[WARN]</span> Drone battery at 45% capacity.</p>
              <p><span className="text-blue-500">[INFO]</span> User session verified via OAuth provider.</p>
              <p><span className="text-slate-600">[SYSTEM]</span> Kernel initialization sequence finished.</p>
           </div>
        </div>

      </div>
    </motion.main>
  )
}

function InfoField({ icon, label, value, isEditing, onChange }) {
   return (
      <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
         <div className="flex items-center gap-2 mb-2 text-slate-500">{icon}<p className="text-[10px] uppercase font-bold">{label}</p></div>
         {isEditing ? (
           <input 
             value={value} 
             onChange={onChange} 
             className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
           />
         ) : (
           <p className="font-medium text-slate-800 dark:text-slate-200">{value || 'Not Set'}</p>
         )}
      </div>
   )
}

function SkillBar({ label, level, color }) {
   return (
      <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>{label}</span>
            <span>{level}</span>
         </div>
         <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{width: level}}></div>
         </div>
      </div>
   )
}