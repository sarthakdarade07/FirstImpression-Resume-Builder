import React, { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

const SuccessToast = ({ message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  useEffect(() => {
    // Start the exit "float up" animation slightly before 4 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3600); // 3.6s

    // Actually fire the onClose prop exactly at 4 seconds to remove it from the DOM
    const closeTimer = setTimeout(() => {
      onClose();
    }, 4000); // 4.0s

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    // "fixed top-6 left-1/2 -translate-x-1/2" centers it perfectly at the top of the screen
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
      <style>
        {`
          @keyframes toastEnter {
            0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes toastExit {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-30px) scale(0.9); }
          }
          .animate-toast-enter {
            animation: toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-toast-exit {
            animation: toastExit 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      <div
        className={`flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-xl border border-green-100 shadow-2xl shadow-green-500/15 rounded-2xl text-gray-800 font-medium text-sm sm:text-[15px] tracking-tight min-w-[280px] max-w-sm ${isExiting ? "animate-toast-exit" : "animate-toast-enter"}`}>
        {/* Success Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
        </div>

        {/* Dynamic String Message */}
        <p className="flex-grow pr-2 truncate">{message}</p>

        {/* Optional Manual Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors p-1">
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
