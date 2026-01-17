import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, Mail, MapPin, CheckCircle2, 
  Loader2, ScanEye, Eye, EyeOff, Trash2, Siren, Crosshair
} from 'lucide-react'
import { supabase } from '../../Supabase/supabase' 

// 🟢 NEW KRYPTONITE BACKEND
const BACKEND_PROXY = "https://kryptonite-8k3u.vercel.app"

export default function Complaints() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // 🤖 AI & EMAIL STATE
  const [analyzingId, setAnalyzingId] = useState(null)
  const [analysisResults, setAnalysisResults] = useState({}) 
  const [aiVerdict, setAiVerdict] = useState({}) 
  const [viewMode, setViewMode] = useState({}) 
  const [sendingEmail, setSendingEmail] = useState(false)

  // 🟢 FETCH REPORTS
  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  // 🟢 REALTIME LISTENER
  useEffect(() => {
    fetchReports()
    const channel = supabase
      .channel('complaints-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        if (payload.eventType === 'INSERT') setReports(prev => [payload.new, ...prev])
        else if (payload.eventType === 'UPDATE') setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new : r))
        else if (payload.eventType === 'DELETE') setReports(prev => prev.filter(r => r.id !== payload.old.id))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // 🟢 1. DEPLOY DRONE ACTION
  const handleDeployDrone = (report) => {
    navigate('/drone-control', { 
      state: { 
        target: { 
          lat: report.latitude, 
          lon: report.longitude, 
          id: report.id 
        },
        mode: 'INTERCEPT'
      } 
    })
  }

  // 🟢 2. AI SCAN LOGIC (UPDATED FOR KRYPTONITE API)
  const handleAnalyze = async (report) => {
    if (!report.image_url) return alert("No image to analyze")
    setAnalyzingId(report.id)

    try {
      // Fetch image and convert to File
      const imgRes = await fetch(report.image_url)
      const blob = await imgRes.blob()
      const file = new File([blob], "evidence.jpg", { type: "image/jpeg" })
      
      const formData = new FormData()
      formData.append('image', file) // 👈 Changed from 'file' to 'image'

      // Send to Vercel Backend
      const response = await fetch(`${BACKEND_PROXY}/api/fires/draw_boxes_fire`, { 
        method: 'POST', 
        body: formData 
      })
      const result = await response.json()

      if (result.image_base64) { // 👈 Changed from 'data' to 'image_base64'
        // Fire Found
        const base64Image = `data:image/${result.format || 'jpeg'};base64,${result.image_base64}`
        setAnalysisResults(prev => ({ ...prev, [report.id]: base64Image }))
        setViewMode(prev => ({ ...prev, [report.id]: 'ai' })) 
        setAiVerdict(prev => ({ ...prev, [report.id]: true })) 
        updateStatus(report.id, 'verified')
        alert("⚠️ AI ALERT: Fire Detected! Ready for Drone Deployment.")
      } else {
        // Safe
        setAiVerdict(prev => ({ ...prev, [report.id]: false }))
        updateStatus(report.id, 'false_alarm')
        alert("✅ AI RESULT: Safe. No fire detected.")
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error)
      alert("Failed to connect to Neural Engine. Is the backend running?")
    } finally {
      setAnalyzingId(null)
    }
  }

  // 🟢 3. SMART EMAIL SENDER
  const handleSmartEmail = async (report) => {
    if (!report.email) return alert("No email provided.")
    setSendingEmail(true)

    const isFire = aiVerdict[report.id]
    const reportIdStr = String(report.id).slice(0, 6)

    const emailSubject = isFire 
      ? `[URGENT] Fire Confirmed - Report #${reportIdStr}`
      : `Report #${reportIdStr} Update - False Alarm`

    const emailDescription = isFire
      ? `⚠️ DANGER: Our AI systems have CONFIRMED fire in your reported image. Drones have been dispatched to coordinates: ${report.latitude}, ${report.longitude}.`
      : `✅ NOTICE: Our AI analysis scanned your image and detected NO active fire. This report has been marked as a false alarm.`

    try {
      const response = await fetch('https://fxksnraszpzgqouxcuvl.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: report.email,
          subject: emailSubject,
          description: emailDescription,
          type: 'update',
          status: isFire ? 'VERIFIED_DANGER' : 'FALSE_ALARM',
          id: reportIdStr
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Email Error:", result)
        alert("Failed to send email. Check console.")
      } else {
        alert(`Email sent: ${isFire ? "DANGER WARNING" : "FALSE ALARM NOTICE"}`)
      }

    } catch (e) {
      console.error(e)
      alert("Network Error: Failed to send email.")
    } finally {
      setSendingEmail(false)
    }
  }

  // 🟢 4. RESOLVE & DELETE
  const handleResolveAndDelete = async (report) => {
    if(!window.confirm("Delete report permanently?")) return;
    try {
        const { error } = await supabase.from('reports').delete().eq('id', report.id)
        if (error) throw error
        setReports(prev => prev.filter(r => r.id !== report.id))
    } catch (error) { console.error(error) }
  }

  const updateStatus = async (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    await supabase.from('reports').update({ status: newStatus }).eq('id', id)
  }

  const toggleView = (id) => {
    setViewMode(prev => ({ ...prev, [id]: prev[id] === 'ai' ? 'original' : 'ai' }))
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={48} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-6 md:p-12 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
              <ShieldAlert className="text-red-600" size={40} />
              Incident Registry
            </h1>
            <p className="text-slate-500 font-bold mt-2 ml-14">
              Total Reports: <span className="text-red-500">{reports.length}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {reports.map((report) => (
              <motion.div 
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden shadow-xl flex flex-col ${
                  report.status === 'verified' ? 'border-red-500/50 shadow-red-500/10' : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {/* IMAGE HEADER */}
                <div className="h-64 bg-slate-100 dark:bg-black relative group overflow-hidden">
                   <img 
                     src={viewMode[report.id] === 'ai' ? analysisResults[report.id] : report.image_url} 
                     className="w-full h-full object-cover transition duration-700" 
                     alt="Evidence" 
                   />
                   
                   <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm z-20 ${
                     report.status === 'verified' ? 'bg-red-600 text-white border-red-500 animate-pulse' :
                     report.status === 'false_alarm' ? 'bg-slate-700 text-slate-300' :
                     'bg-orange-500 text-white'
                   }`}>
                     {report.status}
                   </div>

                   {analysisResults[report.id] && (
                     <button onClick={() => toggleView(report.id)} className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase backdrop-blur-md flex items-center gap-2 border border-white/20 z-20">
                        {viewMode[report.id] === 'ai' ? <EyeOff size={14}/> : <Eye size={14}/>} AI View
                     </button>
                   )}

                   {analyzingId === report.id && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                        <span className="text-blue-400 font-mono text-xs uppercase animate-pulse">Scanning...</span>
                     </div>
                   )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                      {report.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-500 font-mono border-t border-b border-slate-100 dark:border-white/5 py-4 mb-6">
                    <div className="flex items-center gap-2 col-span-2 text-blue-500 font-bold"><Mail size={14}/> {report.email || "No Email"}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-red-500"/> {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleDeployDrone(report)}
                      className="col-span-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg mb-2"
                    >
                      <Crosshair size={14} /> Deploy Interceptor
                    </button>

                    <button 
                      onClick={() => handleAnalyze(report)}
                      disabled={analyzingId === report.id}
                      className="col-span-2 bg-slate-800 hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <ScanEye size={16} /> {aiVerdict[report.id] !== undefined ? "Re-Scan Evidence" : "Run AI Scan"}
                    </button>

                    {aiVerdict[report.id] === true && (
                       <button 
                         onClick={() => handleSmartEmail(report)}
                         disabled={!report.email || sendingEmail}
                         className="col-span-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 animate-pulse"
                       >
                         {sendingEmail ? <Loader2 className="animate-spin" size={14}/> : <Siren size={14} />} 
                         Send DANGER Alert
                       </button>
                    )}

                    {aiVerdict[report.id] === false && (
                       <button 
                         onClick={() => handleSmartEmail(report)}
                         disabled={!report.email || sendingEmail}
                         className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                       >
                         {sendingEmail ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle2 size={14} />} 
                         Send SAFE Notice
                       </button>
                    )}

                    <button onClick={() => handleResolveAndDelete(report)} className="col-span-2 border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-red-50 hover:text-red-500 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 mt-2">
                      <Trash2 size={12} /> Remove Report
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}