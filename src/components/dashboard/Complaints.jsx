import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, Mail, MapPin, Clock, CheckCircle2, 
  XCircle, Loader2, AlertTriangle, ExternalLink, ScanEye, Eye, EyeOff
} from 'lucide-react'
import { supabase } from '../../Supabase/supabase' 

// 🟢 BACKEND CONFIG
const BACKEND_PROXY = "/api"

export default function Complaints() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // 🤖 AI ANALYSIS STATE
  const [analyzingId, setAnalyzingId] = useState(null) // Which ID is currently loading
  const [analysisResults, setAnalysisResults] = useState({}) // Stores base64 results: { id: 'base64string' }
  const [viewMode, setViewMode] = useState({}) // Stores toggle state: { id: 'original' | 'ai' }

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
        if (payload.eventType === 'INSERT') {
          setReports(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new : r))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // 🟢 ACTION: SEND TO YOLO
  const handleAnalyze = async (report) => {
    if (!report.image_url) return alert("No image to analyze")
    
    // If we already have the result, just toggle the view
    if (analysisResults[report.id]) {
      setViewMode(prev => ({ ...prev, [report.id]: 'ai' }))
      return
    }

    setAnalyzingId(report.id)

    try {
      // 1. Fetch the image file from the URL (Cross-Origin hack might be needed depending on Supabase settings)
      const imgRes = await fetch(report.image_url)
      const blob = await imgRes.blob()
      const file = new File([blob], "evidence.jpg", { type: "image/jpeg" })

      // 2. Prepare Form Data
      const formData = new FormData()
      formData.append('file', file)

      // 3. Send to Python Backend
      const response = await fetch(`${BACKEND_PROXY}/draw_boxes_fire`, { 
        method: 'POST', 
        body: formData 
      })
      const result = await response.json()

      // 4. Save Result
      if (result.data) {
        const base64Image = `data:image/jpeg;base64,${result.data}`
        setAnalysisResults(prev => ({ ...prev, [report.id]: base64Image }))
        setViewMode(prev => ({ ...prev, [report.id]: 'ai' })) // Auto-switch to AI view
      } else {
        alert("AI Analysis Complete: No Fire Detected")
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error)
      alert("Failed to connect to Neural Engine.")
    } finally {
      setAnalyzingId(null)
    }
  }

  // Helper to toggle view
  const toggleView = (id) => {
    setViewMode(prev => ({ ...prev, [id]: prev[id] === 'ai' ? 'original' : 'ai' }))
  }

  const updateStatus = async (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    await supabase.from('reports').update({ status: newStatus }).eq('id', id)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={48} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-6 md:p-12 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
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

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {reports.map((report) => (
              <motion.div 
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden shadow-xl flex flex-col ${
                  report.status === 'pending' ? 'border-orange-500/50 dark:border-orange-500/30 ring-4 ring-orange-500/10' : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100 transition-opacity'
                }`}
              >
                {/* IMAGE HEADER */}
                <div className="h-64 bg-slate-100 dark:bg-black relative group overflow-hidden">
                  {report.image_url ? (
                    <>
                       {/* The Image (Swaps between Original and AI) */}
                       <img 
                         src={viewMode[report.id] === 'ai' ? analysisResults[report.id] : report.image_url} 
                         className="w-full h-full object-cover transition duration-700" 
                         alt="Evidence" 
                       />
                       
                       {/* Status Badge */}
                       <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm z-20 ${
                         report.status === 'verified' ? 'bg-green-500/90 text-white border-green-400' :
                         report.status === 'false_alarm' ? 'bg-slate-800/90 text-slate-300 border-slate-600' :
                         'bg-orange-500/90 text-white border-orange-400 animate-pulse'
                       }`}>
                         {report.status.replace('_', ' ')}
                       </div>

                       {/* AI View Toggle Button (Only appears if AI result exists) */}
                       {analysisResults[report.id] && (
                         <button 
                           onClick={() => toggleView(report.id)}
                           className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase backdrop-blur-md flex items-center gap-2 border border-white/20 transition z-20"
                         >
                            {viewMode[report.id] === 'ai' ? <EyeOff size={14}/> : <Eye size={14}/>}
                            {viewMode[report.id] === 'ai' ? "Hide AI" : "Show AI"}
                         </button>
                       )}

                       {/* Loading Overlay */}
                       {analyzingId === report.id && (
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                            <span className="text-blue-400 font-mono text-xs uppercase animate-pulse">Running YOLOv8...</span>
                         </div>
                       )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <AlertTriangle size={48} className="opacity-20 mb-2"/>
                      <span className="text-xs font-mono uppercase">No Visual Data</span>
                    </div>
                  )}
                </div>

                {/* CONTENT BODY */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Situation Report</h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                      {report.description || "No description provided."}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-500 font-mono border-t border-b border-slate-100 dark:border-white/5 py-4 mb-6">
                    <div className="flex items-center gap-2 col-span-2">
                       <Mail size={14} className="text-blue-500"/> 
                       <span className="truncate">{report.email || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-red-500"/> 
                       {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                       <Clock size={14} className="text-orange-500"/> 
                       {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    {/* 🟢 NEW: ANALYZE BUTTON */}
                    <button 
                      onClick={() => handleAnalyze(report)}
                      disabled={analyzingId === report.id}
                      className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      <ScanEye size={16} /> {analysisResults[report.id] ? "Re-Scan Evidence" : "Scan Evidence (AI)"}
                    </button>

                    <button 
                      onClick={() => updateStatus(report.id, 'verified')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                        report.status === 'verified' ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 size={16} /> Verify
                    </button>
                    
                    <button 
                      onClick={() => updateStatus(report.id, 'false_alarm')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                        report.status === 'false_alarm' ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <XCircle size={16} /> Dismiss
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