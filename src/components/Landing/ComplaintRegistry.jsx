import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, MapPin, Send, CheckCircle2, AlertTriangle, Loader2, X, ArrowLeft, Camera, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../Supabase/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function ComplaintRegistry({ isStandalone }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ description: '', email: '', lat: null, lng: null })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle')

  const CONTROL_ROOM_BG = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf5j20cJzoEx7Xat-ftOP9yWj6adiD3BKI2A&s"

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setForm(f => ({ ...f, lat: p.coords.latitude, lng: p.coords.longitude }))
        },
        (e) => toast.error("GPS Link Failed. Enable location services.")
      )
    }
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      toast.success("Visual Evidence Attached")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      toast.error("Critical Error: Visual Evidence Required.")
      setStatus('error')
      return 
    }

    setStatus('uploading')
    const toastId = toast.loading("Encrypting & Transmitting Intelligence...")

    try {
      let imageUrl = null
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('fire-reports').upload(fileName, image)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('fire-reports').getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }

      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert([{
            description: form.description,
            email: form.email,
            latitude: form.lat,
            longitude: form.lng,
            image_url: imageUrl,
            status: 'pending'
        }])
        .select().single()

      if (dbError) throw dbError

      // Email Logic...
      toast.success("Transmission Confirmed", { id: toastId })
      setStatus('success')
      setForm({ description: '', email: '', lat: form.lat, lng: form.lng })
      setImage(null)
      setPreview(null)
    } catch (error) {
      toast.error("Transmission Interrupted: " + error.message, { id: toastId })
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {/* 🖼️ TACTICAL CONTROL ROOM BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${CONTROL_ROOM_BG})` }}
      />

      {/* 🌑 GLASS THEME OVERLAY */}
      <div className="absolute inset-0 z-10 bg-slate-950/65 backdrop-blur-[5px]" />

      {/* 🔙 RETURN BUTTON */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Abort Mission
      </button>

      {/* 🚀 REGISTRY CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 w-full max-w-xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/30 mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Civil <span className="text-orange-500">Reconnaissance</span>
          </h1>
          <p className="text-slate-300/70 text-[10px] font-mono font-black uppercase tracking-[0.3em] mt-3">
            Priority One: Hazard Intelligence Upload
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase italic">Report Logged</h3>
              <p className="text-slate-400 text-sm mb-8">Transmission secured in the defense grid.</p>
              <button 
                onClick={() => setStatus('idle')} 
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-orange-500 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
              >
                New Reconnaissance
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div className="relative group">
                <input type="file" accept="image/*" onChange={handleImageChange} className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 ${preview ? 'hidden' : 'block'}`} />
                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 bg-black/20 ${
                    preview ? 'border-orange-500/50 bg-orange-500/5' : 
                    status === 'error' && !image ? 'border-red-500 bg-red-500/10' :
                    'border-white/10 group-hover:border-orange-500/50 group-hover:bg-white/5'
                }`}>
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="h-44 w-full object-contain rounded-xl mx-auto" />
                      <button className="absolute -top-2 -right-2 bg-red-600 p-2 rounded-full text-white z-30 shadow-lg" onClick={(e) => { e.preventDefault(); setImage(null); setPreview(null); }}><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Camera className={`mx-auto transition-colors ${status === 'error' && !image ? 'text-red-500' : 'text-slate-500 group-hover:text-orange-500'}`} size={40} />
                      <p className={`text-[10px] font-mono font-black uppercase tracking-widest ${status === 'error' && !image ? 'text-red-400' : 'text-slate-400'}`}>
                        {status === 'error' && !image ? "Evidence Required *" : "Upload Spatial Evidence"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Inputs */}
              <div className="space-y-4">
                <textarea 
                  required 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500/50 outline-none font-mono text-sm placeholder:text-slate-600 resize-none" 
                  placeholder="Describe the hazard intensity and scope..." 
                  rows="3" 
                />
                <input 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500/50 outline-none font-mono text-sm placeholder:text-slate-600" 
                  placeholder="Commander Email for confirmation" 
                />
                
                {/* GPS Telemetry Bar */}
                <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-orange-500" size={16} />
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Geo-Coordinates:</span>
                  </div>
                  <div className="text-[10px] font-mono text-orange-500 font-bold">
                    {form.lat ? `${form.lat.toFixed(4)}° N, ${form.lng.toFixed(4)}° E` : "Syncing Satellite..."}
                  </div>
                </div>
              </div>

              <button 
                disabled={status === 'uploading'} 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-orange-950/40 uppercase tracking-[0.2em] text-sm"
              >
                {status === 'uploading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Execute Transmission</>}
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 📡 Grid UI Detail */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  )
}