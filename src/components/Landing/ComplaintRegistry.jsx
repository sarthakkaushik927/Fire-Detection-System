import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, MapPin, Send, CheckCircle2, AlertTriangle, Loader2, X } from 'lucide-react'
import { supabase } from '../../Supabase/supabase'
import toast, { Toaster } from 'react-hot-toast' // 🟢 IMPORT TOAST

export default function ComplaintRegistry({ isStandalone }) {
  const [form, setForm] = useState({ description: '', email: '', lat: null, lng: null })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
           setForm(f => ({ ...f, lat: p.coords.latitude, lng: p.coords.longitude }))
           // Optional: only show if you want them to know gps is locked
           // toast.success("GPS Location Locked", { id: 'gps', icon: '📍' }) 
        },
        (e) => toast.error("Could not fetch location. Please enable GPS.")
      )
    }
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      toast.success("Evidence Attached")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔴 Validation with Toast
    if (!image) {
      toast.error("Evidence Required: Please upload an image.")
      setStatus('error')
      return 
    }

    setStatus('uploading')
    // 🟢 Show Loading Toast
    const toastId = toast.loading("Encrypting & Transmitting Report...")

    try {
      let imageUrl = null

      // 1. Upload
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('fire images').upload(fileName, image)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('fire images').getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }

      // 2. DB Insert
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

      // 3. Send Email
      if (form.email && reportData) {
        const safeId = String(reportData.id).slice(0, 8) 
        await fetch('https://fxksnraszpzgqouxcuvl.supabase.co/functions/v1/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            to: form.email,
            subject: 'FireWatch Report Received',
            type: 'confirmation',
            id: safeId,
            description: form.description,
            lat: form.lat,
            lng: form.lng
          })
        })
      }

      // 🟢 Update Toast to Success
      toast.success("Report Logged Successfully!", { id: toastId })
      
      setStatus('success')
      setForm({ description: '', email: '', lat: form.lat, lng: form.lng })
      setImage(null)
      setPreview(null)

    } catch (error) {
      console.error(error)
      // 🔴 Update Toast to Error
      toast.error("Transmission Failed: " + error.message, { id: toastId })
      setStatus('error')
    }
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center relative overflow-hidden ${isStandalone ? '' : 'pt-20'}`}>
      {/* 🟢 TOASTER COMPONENT */}
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2">Report Fire Hazard</h1>
          <p className="text-slate-400">Submit visual evidence for rapid response.</p>
        </div>

        {status === 'success' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Report Received</h3>
            <p className="text-slate-400 mb-6">Confirmation sent to your email.</p>
            <button onClick={() => setStatus('idle')} className="text-orange-500 font-bold hover:underline">Submit Another Report</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleImageChange} className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 ${preview ? 'hidden' : 'block'}`} />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  preview ? 'border-orange-500 bg-orange-500/5' : 
                  status === 'error' && !image ? 'border-red-500 bg-red-500/10' :
                  'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}>
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="h-48 w-full object-contain rounded-xl mx-auto bg-black/40" />
                    <button className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white z-30 hover:bg-red-500 transition" onClick={(e) => { e.preventDefault(); setImage(null); setPreview(null); }}><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <Upload className={`mx-auto mb-3 transition-colors ${status === 'error' && !image ? 'text-red-500' : 'text-slate-500'}`} size={32} />
                    <p className={`text-sm font-bold ${status === 'error' && !image ? 'text-red-400' : 'text-slate-300'}`}>
                      {status === 'error' && !image ? "Evidence Required *" : "Click to upload evidence"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Description..." rows="3" />
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Contact Email" />
              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <MapPin className="text-orange-500" size={18} />
                <div className="text-xs text-slate-400 font-mono">{form.lat ? `LAT: ${form.lat.toFixed(4)}` : "Acquiring GPS..."}</div>
              </div>
            </div>

            <button disabled={status === 'uploading'} className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {status === 'uploading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Transmit Report</>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}