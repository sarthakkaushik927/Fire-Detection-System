import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../Supabase/supabase' 
import { Camera, MapPin, Send, Loader2, CheckCircle2, ArrowLeft, Mail } from 'lucide-react'

export default function ReportFire() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [location, setLocation] = useState(null)
  const [email, setEmail] = useState('') // 🟢 New Email State
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const fileInputRef = useRef(null)

  // 1. Get GPS Location
  const getLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLoading(false)
      }, (err) => {
        alert("Location access denied. Please enable GPS.")
        setLoading(false)
      })
    } else {
        alert("GPS not supported on this browser.")
        setLoading(false)
    }
  }

  // 2. Handle Image Selection
  const handleFile = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      if(!location) getLocation() 
    }
  }

  // 3. Upload to Supabase & Save Email
  const handleSubmit = async () => {
    if (!file || !location || !email) return alert("Please provide photo, location, and email.")
    
    setLoading(true)
    try {
      // A. Upload Image
      const fileName = `${Date.now()}_fire_report.jpg`
      const { error: uploadError } = await supabase.storage
        .from('fire-reports') 
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('fire-reports').getPublicUrl(fileName)
      const imageUrl = publicUrlData.publicUrl

      // B. Save Data (Including Email)
      const { error: dbError } = await supabase
        .from('reports') 
        .insert([{ 
           image_url: imageUrl, 
           latitude: location.lat, 
           longitude: location.lon, 
           status: 'pending',
           email: email // 🟢 Saving Email
        }])

      if (dbError) throw dbError

      setSent(true)
    } catch (error) {
      console.error("Upload Error:", error)
      alert("Failed to send report. Check console.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold mb-2">Report Sent!</h1>
      <p className="text-slate-400 mb-6">
        Drone units have been notified.<br/>
        A confirmation has been sent to <span className="text-white font-bold">{email}</span>.
      </p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-slate-800 rounded-xl font-bold uppercase text-sm hover:bg-slate-700">Return Home</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-6 max-w-md mx-auto relative overflow-hidden transition-colors">
      
      {/* 🟢 BACK BUTTON */}
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-white dark:bg-slate-900 rounded-full shadow-md z-10 text-slate-600 dark:text-white">
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-2xl font-black text-red-600 mb-6 mt-12 uppercase tracking-wider flex items-center gap-2">
        <Send className="rotate-45" size={24}/> Fire Watch
      </h1>

      <div className="flex-1 flex flex-col gap-4">
        
        {/* Step 1: Image Capture */}
        <div 
          onClick={() => fileInputRef.current.click()}
          className="aspect-square bg-slate-200 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative active:scale-95 transition-transform group"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={48} className="text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-slate-500 uppercase text-sm">Tap to Capture Fire</p>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" capture="environment" className="hidden" />
        </div>

        {/* Step 2: Location Status */}
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${location ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
          <MapPin size={20} className={loading && !location ? "animate-bounce" : ""} />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase">{location ? "Location Locked" : "Locating..."}</p>
            <p className="text-[10px] font-mono">{location ? `${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}` : "Waiting for GPS..."}</p>
          </div>
        </div>

        {/* 🟢 Step 3: Email Input */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
           <Mail size={20} className="text-slate-400"/>
           <input 
             type="email" 
             placeholder="Enter Email for Reward" 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:font-normal"
           />
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={!file || !location || !email || loading}
          className="w-full bg-red-600 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-lg shadow-lg shadow-red-500/30 active:scale-95 transition-all mt-auto"
        >
          {loading ? <Loader2 className="animate-spin mx-auto"/> : "SEND REPORT"}
        </button>

      </div>
    </div>
  )
}