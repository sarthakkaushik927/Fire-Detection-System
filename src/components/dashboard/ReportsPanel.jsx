import { motion } from 'framer-motion'
import { User, MapPin, CheckCircle2, XCircle, BellRing, Upload } from 'lucide-react'

export default function ReportsPanel({ 
  userReports, 
  handleVerify, 
  handleDismiss, 
  handleSimulationUpload, 
  simLoading, 
  variants 
}) {
  return (
    <motion.div variants={variants} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/10 flex-1 flex flex-col min-h-[400px] lg:min-h-0 transition-colors relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
        
        <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm uppercase tracking-wide flex items-center gap-2">
                <User size={16} className="text-orange-500"/> Civilian Reports
            </h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${userReports.length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                {userReports.length} LIVE
            </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[300px] lg:max-h-none">
            {userReports.length > 0 ? userReports.map((report) => (
                <motion.div 
                    key={report.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-white/5 relative group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-mono text-slate-400">{new Date(report.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-white/5 px-2 py-1 rounded">
                            <MapPin size={10} /> {report.latitude.toFixed(3)}, {report.longitude.toFixed(3)}
                        </div>
                    </div>

                    {report.image_url && (
                        <div className="h-32 w-full rounded-lg overflow-hidden mb-3 bg-black relative">
                            <img src={report.image_url} className="w-full h-full object-cover" alt="Evidence" />
                        </div>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                        {report.description || "Suspicious smoke detected..."}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleVerify(report)} className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                            <CheckCircle2 size={12} /> Deploy
                        </button>
                        <button onClick={() => handleDismiss(report.id)} className="bg-slate-200 dark:bg-white/10 hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                            <XCircle size={12} /> Dismiss
                        </button>
                    </div>
                </motion.div>
            )) : (
                <div className="text-center py-12 opacity-50">
                    <BellRing size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold uppercase text-slate-400">All Sectors Clear</p>
                </div>
            )}
        </div>
        
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
            <label className="flex items-center justify-center p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 hover:text-orange-500 transition text-slate-400 dark:text-slate-500 text-xs font-bold uppercase gap-2 group bg-slate-50 dark:bg-slate-900/50">
                <Upload size={14} className="group-hover:scale-110 transition-transform"/> 
                {simLoading ? "Analyzing..." : "Upload Satellite Data"}
                <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
            </label>
        </div>
    </motion.div>
  )
}