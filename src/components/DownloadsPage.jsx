import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Trash2, Download, Image as ImageIcon, Calendar } from 'lucide-react'
import { getImages, deleteImage } from '../utils/db'
import { motion, AnimatePresence } from 'framer-motion'

export default function DownloadsPage() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    const data = await getImages()
    setImages(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm("Delete this capture?")) {
      await deleteImage(id)
      loadImages()
      if (selectedImage?.id === id) setSelectedImage(null)
    }
  }

  return (
    <div className="min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-600 dark:text-white">
                <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Drone Gallery</h1>
                <p className="text-xs text-slate-500 font-bold">{images.length} CAPTURES STORED LOCALLY</p>
            </div>
        </div>
      </div>

      {/* GALLERY GRID - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {images.length === 0 ? (
            <div className="col-span-full h-80 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
                <ImageIcon size={48} className="mb-4 opacity-50"/>
                <p className="font-bold uppercase tracking-widest text-slate-500 text-sm">No Images Saved</p>
                <p className="text-xs mt-2 text-slate-400 text-center px-4">Capture images from the Dashboard to see them here.</p>
            </div>
        ) : (
            images.map((img) => (
                <motion.div 
                    key={img.id}
                    layoutId={img.id}
                    onClick={() => setSelectedImage(img)}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group relative shadow-lg transition-colors duration-300"
                >
                    <div className="aspect-video bg-slate-100 dark:bg-black relative">
                        <img src={img.image} alt="Capture" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <span className="text-xs font-bold uppercase tracking-widest text-white">View Fullscreen</span>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                <Calendar size={10}/> {new Date(img.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-xs font-mono text-slate-400 dark:text-slate-300">
                                {new Date(img.timestamp).toLocaleTimeString()}
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

      {/* FULLSCREEN MODAL - RESPONSIVE */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                onClick={() => setSelectedImage(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    className="w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                        <img src={selectedImage.image} className="max-w-full max-h-full object-contain" alt="Full View"/>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="text-center md:text-left">
                            <h3 className="font-bold text-base md:text-lg text-white">Capture Details</h3>
                            <p className="text-slate-400 text-xs md:text-sm font-mono">ID: {selectedImage.id} • {selectedImage.timestamp}</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <a 
                                href={selectedImage.image} 
                                download={`firewatch_capture_${selectedImage.id}.jpg`}
                                className="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition text-sm"
                            >
                                <Download size={18} /> <span className="hidden sm:inline">Download</span>
                            </a>
                            <button 
                                onClick={(e) => handleDelete(selectedImage.id, e)}
                                className="flex-1 md:flex-none justify-center bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 px-4 md:px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition text-sm"
                            >
                                <Trash2 size={18} /> <span className="hidden sm:inline">Delete</span>
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