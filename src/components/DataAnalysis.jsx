import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image, Loader2, RefreshCw, AlertTriangle, FileBarChart } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'


const ANALYZER_API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/fires/data_analyser`

const DataAnalysis = () => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

  
    const extractImages = (data) => {
        let found = []

        const search = (item) => {
            if (!item) return

            if (Array.isArray(item)) {
                item.forEach(search)
            }
            else if (typeof item === 'object') {
                Object.values(item).forEach(search)
            }
            else if (typeof item === 'string') {
               
                const trimmed = item.trim();
               
                if (trimmed.startsWith('iVBOR')) {
                 
                    found.push(`data:image/png;base64,${trimmed}`)
                }
                
                else if (trimmed.startsWith('data:image')) {
                    found.push(trimmed)
                }
            }
        }

        search(data)
        return found
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch(ANALYZER_API)

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`)
            }

            const result = await res.json()

            
            const imageList = extractImages(result)

            if (imageList.length === 0) {
                console.warn("API Response content:", result)
                throw new Error("No image data detected in response")
            }

            setImages(imageList)
            toast.success(`${imageList.length} Analysis Charts Received`)

        } catch (e) {
            console.error("Fetch Error:", e)
            toast.error("Failed to retrieve charts")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 md:p-6 min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 transition-colors"
        >
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

            <div className="max-w-screen mx-auto space-y-6">

                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                            <FileBarChart className="text-orange-600" /> Visual Analytics Of Last 3 Days
                        </h1>
                        <p className="text-xs font-mono font-bold text-slate-400">SOURCE: REMOTE ANALYZER</p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-white font-bold text-xs uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <Loader2 size={48} className="text-orange-500 animate-spin" />
                        <p className="text-slate-400 font-mono text-sm">Processing Data Stream...</p>
                    </div>
                ) : images.length > 0 ? (
                  
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {images.map((imgSrc, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden group"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <Image size={20} className="text-orange-500" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Graph {index + 1}</h3>
                                </div>

                                
                                <div className="relative rounded-2xl overflow-hidden bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 p-2 flex items-center justify-center min-h-[350px]">
                                    <img
                                        src={imgSrc}
                                        alt={`Analysis Chart ${index + 1}`}
                                        className="w-full h-auto object-contain max-h-[600px] rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                        <AlertTriangle size={48} className="mb-4 text-red-500" />
                        <h3 className="text-xl font-bold">No Visuals Received</h3>
                        <p>The server responded, but no valid PNG data was found.</p>
                    </div>
                )}
            </div>
        </motion.main>
    )
}

export default DataAnalysis