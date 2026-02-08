import { useState } from "react";
// import QRCode from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";

import { useNavigate } from "react-router-dom";

export default function LiveStreamQR() {
  const navigate = useNavigate();
  const [roomId] = useState(() => crypto.randomUUID());

  const streamUrl = `${window.location.origin}/stream/${roomId}`;

  return (
    <div className="bg-slate-900 p-6 rounded-xl flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-white">
        Start Live Fire Report
      </h2>

      <QRCodeCanvas  value={streamUrl} size={220} />

      <p className="text-xs text-gray-400 text-center break-all">
        {streamUrl}
      </p>

      <button
        onClick={() => navigate(`/view/${roomId}`)}
        className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        Open Viewer
      </button>
    </div>
  );
}