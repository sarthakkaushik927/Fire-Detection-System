import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ExternalLink, Scan, QrCode, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function LiveStreamQR() {
  const navigate = useNavigate();
  // Generate a persistent Mission ID
  const [roomId] = useState(() => crypto.randomUUID().slice(0, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

  // 1. The Mobile Link (Camera Source)
  const streamUrl = `${window.location.protocol}//${window.location.host}/stream/${roomId}`;

  // 2. The Desktop Link (Command Center)
  const viewUrl = `/view/${roomId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(streamUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center text-center max-w-sm w-full mx-auto relative overflow-hidden group">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-blue-500 opacity-50" />

      {/* Icon Header */}
      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
        <QrCode className="text-blue-400" size={24} />
      </div>

      <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1">
        Initialize Drone Link
      </h2>
      <p className="text-xs text-slate-400 font-mono mb-6">
        Scan to turn your mobile into a surveillance camera.
      </p>

      {/* QR Container with Glow */}
      <div className="relative p-4 bg-white rounded-xl shadow-lg mb-6 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow duration-500">
        <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-xl m-1 pointer-events-none" />
        <QRCodeCanvas
          value={streamUrl}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"H"}
          includeMargin={false}
        />
      </div>

      {/* Mobile URL Display */}
      <div className="w-full bg-slate-950/50 p-2 rounded-lg border border-white/5 mb-4 flex items-center gap-2">
        <Smartphone size={14} className="text-slate-500" />
        <p className="text-[10px] text-slate-400 font-mono truncate flex-1 text-left">
          {streamUrl}
        </p>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors group/copy"
          title="Copy link"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-slate-500 group-hover/copy:text-blue-400" />
          )}
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(viewUrl)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
      >
        <ExternalLink size={16} /> Enter Command Center
      </button>

      <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-slate-600 uppercase">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        Secure Channel: {roomId}
      </div>
    </div>
  );
}