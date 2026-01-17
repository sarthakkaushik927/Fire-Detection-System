import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, MapPin, Send, CheckCircle2, AlertTriangle, Loader2, X, ScanEye } from 'lucide-react'
// 🟢 Import your single client
import { supabase } from '../../Supabase/supabase'

// 🟢 Backend Proxy (Same as your Dashboard)
const BACKEND_PROXY = "/api"

export default function ComplaintRegistry() {
  const [form, setForm] = useState({ description: '', email: '', lat: null, lng: null })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  // 🤖 AI STATE
  const [isScanning, setIsScanning] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  // Get Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setForm(f => ({ ...f, lat: p.coords.latitude, lng: p.coords.longitude })),
        (e) => console.error("Location error:", e)
      )
    }
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setAiResult(null) // Reset AI result on new image
    }
  }

  // 🟢 NEW: Send to YOLO Function
  const handleAnalyzeWithYolo = async (e) => {
    e.preventDefault()
    if (!image) return alert("Please upload an image first!")
    
    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append('file', image)

      // Send to your Python Backend
      const response = await fetch(`${BACKEND_PROXY}/draw_boxes_fire`, { 
        method: 'POST', 
        body: formData 
      })
      
      const result = await response.json()
      
      // If backend returns a base64 image (the one with boxes)
      if (result.data) {
        const aiImageSrc = `data:image/jpeg;base64,${result.data}`
        setPreview(aiImageSrc) // Update preview to show the boxes!
        setAiResult("Fire Detected by AI")
      } else {
        setAiResult("Analysis Complete: No Fire Detected")
      }

    } catch (error) {
      console.error("AI Error:", error)
      alert("Could not connect to AI Neural Engine.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('uploading')
    setErrorMessage('')

    try {
      let imageUrl = null

      // 1. Upload Image to Supabase
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('fire images') 
          .upload(fileName, image)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('fire images')
          .getPublicUrl(fileName)
          
        imageUrl = publicUrlData.publicUrl
      }

      // 2. Submit Report
      const { error: dbError } = await supabase
        .from('reports')
        .insert([{
            description: form.description,
            email: form.email || null,
            latitude: form.lat,
            longitude: form.lng,
            image_url: imageUrl,
            status: aiResult ? 'verified' : 'pending' // Auto-verify if AI saw it!
        }])

      if (dbError) throw dbError

      setStatus('success')
      setForm({ description: '', email: '', lat: form.lat, lng: form.lng })
      setImage(null)
      setPreview(null)
      setAiResult(null)

    } catch (error) {
      console.error("Submission Error:", error)
      setErrorMessage(error.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2">Report Fire Hazard</h1>
          <p className="text-slate-400">Submit visual evidence for immediate AI analysis.</p>
        </div>

        {status === 'success' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Report Received</h3>
            <p className="text-slate-400 mb-6">Our drones have been notified of the coordinates.</p>
            <button onClick={() => setStatus('idle')} className="text-orange-500 font-bold hover:underline">Submit Another Report</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* IMAGE PREVIEW AREA */}
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 ${preview ? 'hidden' : 'block'}`}
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${preview ? 'border-orange-500 bg-orange-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}>
                {preview ? (
                  <div className="relative">
                    {/* The Image (Standard or AI Processed) */}
                    <img src={preview} alt="Preview" className="h-48 w-full object-contain rounded-xl mx-auto bg-black/40" />
                    
                    {/* Clear Button */}
                    <button 
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white z-30 hover:bg-red-500 transition" 
                      onClick={(e) => { e.preventDefault(); setImage(null); setPreview(null); setAiResult(null); }}
                    >
                      <X size={16} />
                    </button>

                    {/* 🤖 SCAN WITH AI BUTTON */}
                    {!aiResult && (
                      <button
                        onClick={handleAnalyzeWithYolo}
                        disabled={isScanning}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
                      >
                        {isScanning ? <Loader2 className="animate-spin" size={14}/> : <ScanEye size={14}/>}
                        {isScanning ? "Scanning..." : "Scan with YOLO"}
                      </button>
                    )}

                    {/* AI Result Badge */}
                    {aiResult && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                        <CheckCircle2 size={14} /> {aiResult}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-slate-500 mb-3" size={32} />
                    <p className="text-sm font-bold text-slate-300">Click to upload evidence</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG supported</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                <textarea 
                  required
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors"
                  placeholder="Describe the smoke, fire size, or location details..."
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Contact Email (Optional)</label>
                <input 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors"
                  placeholder="For updates on this incident"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                <MapPin className="text-orange-500" size={18} />
                <div className="text-xs text-slate-400 font-mono">
                  {form.lat ? `LAT: ${form.lat.toFixed(4)} | LNG: ${form.lng.toFixed(4)}` : "Acquiring Satellite Link..."}
                </div>
              </div>
            </div>

            {status === 'error' && (
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                 <AlertTriangle size={16} /> {errorMessage}
               </div>
            )}

            <button 
              disabled={status === 'uploading' || isScanning}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'uploading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Transmit Report</>}
            </button>

          </form>
        )}
      </motion.div>
    </div>
  )
}