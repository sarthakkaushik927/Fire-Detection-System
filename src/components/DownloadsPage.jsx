import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Trash2, Download, Image as ImageIcon, Calendar, Cpu, Camera, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../Supabase/supabase' 
import toast from 'react-hot-toast'

export default function DownloadsPage() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'capture', 'simulation'

  useEffect(() => {
    fetchImages()
    
    // 🟢 Real-time Listener: Auto-update when Dashboard uploads new files
    const channel = supabase.channel('public:downloads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'downloads' }, () => {
        fetchImages()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // 🟢 1. FETCH FROM SUPABASE
  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Fetch Error:', error.message)
      toast.error('Sync Failed')
    } finally {
      setLoading(false)
    }
  }

  // 🟢 2. DELETE FROM SUPABASE
  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm("Delete this file permanently from the cloud?")) {
      const { error } = await supabase.from('downloads').delete().eq('id', id)
      
      if (error) {
        toast.error("Delete failed")
      } else {
        toast.success("File deleted")
        if (selectedImage?.id === id) setSelectedImage(null)
      }
    }
  }

  // Filter Logic
  const filteredImages = images.filter(img => {
     const type = img.type || 'capture'
     if (filter === 'all') return true
     return type === filter
  })

  return (
    <div className="min-h-screen p-4 md:p-8 pt-24 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-3 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200 dark:border-white/10">
                <ChevronLeft size={24} className="text-slate-600 dark:text-white" />
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Mission Resources</h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2 h-2 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                   <p className="text-xs font-bold text-slate-500">{loading ? 'SYNCING CLOUD...' : `${images.length} FILES SECURED`}</p>
                </div>
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-x-auto">
           {[
             { id: 'all', label: 'All Files' },
             { id: 'capture', label: 'Drone Captures' },
             { id: 'simulation', label: 'AI Sims' }
           ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filter === tab.id 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
           ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && images.length === 0 ? (
             <div className="col-span-full h-96 flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
                <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Retrieving Secure Data...</p>
             </div>
        ) : filteredImages.length === 0 ? (
            <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50">
                <ImageIcon size={64} className="mb-4 opacity-20"/>
                <p className="font-bold uppercase tracking-widest text-slate-500">No {filter !== 'all' ? filter : ''} files found</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-bold uppercase hover:bg-slate-300 transition">Return to Dashboard</button>
            </div>
        ) : (
            filteredImages.map((img) => (
                <motion.div 
                    key={img.id}
                    layoutId={img.id}
                    onClick={() => setSelectedImage(img)}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group relative shadow-lg transition-colors duration-300 flex flex-col"
                >
                    <div className="aspect-video bg-slate-100 dark:bg-black relative overflow-hidden">
                        <img src={img.image_url} alt="Capture" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        
                        {/* TYPE BADGE */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-sm text-white bg-black/40">
                            {img.type === 'simulation' ? <><Cpu size={10} className="text-blue-400"/> AI Sim</> : <><Camera size={10} className="text-orange-400"/> Capture</>}
                        </div>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <span className="text-xs font-bold uppercase tracking-widest text-white border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm">View Fullscreen</span>
                        </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center mt-auto">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                <Calendar size={10}/> {new Date(img.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs font-mono text-slate-400 dark:text-slate-300">
                                {new Date(img.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => handleDelete(img.id, e)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </motion.div>
            ))
        )}
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                onClick={() => setSelectedImage(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    className="w-full max-w-6xl bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden p-2">
                        <img src={selectedImage.image_url} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="Full View"/>
                    </div>
                    
                    <div className="p-6 bg-slate-900 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                        <div className="text-center md:text-left">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2 justify-center md:justify-start">
                                {selectedImage.type === 'simulation' ? <Cpu size={18} className="text-blue-500"/> : <Camera size={18} className="text-orange-500"/>}
                                {selectedImage.type === 'simulation' ? 'AI Simulation Result' : 'Drone Capture'}
                            </h3>
                            <p className="text-slate-500 text-xs font-mono mt-1">ID: {selectedImage.id}</p>
                        </div>
                        
                        <div className="flex w-full md:w-auto gap-3">
                            <a 
                                href={selectedImage.image_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`firewatch_${selectedImage.type || 'capture'}_${selectedImage.id}.jpg`}
                                className="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition text-sm shadow-lg shadow-blue-900/20"
                            >
                                <Download size={18} /> Download
                            </a>
                            <button 
                                onClick={(e) => handleDelete(selectedImage.id, e)}
                                className="flex-1 md:flex-none justify-center bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition text-sm"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}