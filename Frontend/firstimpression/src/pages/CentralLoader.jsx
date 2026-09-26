import React from "react";
import logo from "../Assets/promotional/Firstimpression_icon_logo_copy.webp";

export default function CentralLoader({
  message = "Loading...",
  subMessage = "Please wait a moment",
  fullScreen = true,
  size = "md", // 'sm' | 'md' | 'lg'
}) {
  // Size configurations
  const dimensions =
    {
      sm: { outerRing: "w-12 h-12", logo: "w-6 h-6", text: "text-xs" },
      md: { outerRing: "w-16 h-16", logo: "w-8 h-8", text: "text-sm" },
      lg: { outerRing: "w-24 h-24", logo: "w-12 h-12", text: "text-base" },
    }[size] || dimensions.md;

  const loaderBody = (
    <div className="flex flex-col items-center justify-center gap-4 text-center select-none  ">
      {/* Brand Spinner with Logo */}
      <div className="relative flex items-center justify-center ">
      
        {/* Outer Rotating Gradient Border Ring */}
        <div
          className={`${dimensions.outerRing} rounded-full border-4 border-slate-100 border-t-[#FF4E00] border-r-[#E92B65] animate-spin shadow-lg`}
        />

        {/* Center Logo with Breathing Pulse */}
        <div className="absolute flex items-center justify-center">
          <img
            src={logo}
            alt="First Impression"
            className={`${dimensions.logo} object-contain  animate-pulse`}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col items-center gap-1">
        <h4
          className={`${dimensions.text} font-bold text-gray-800 tracking-tight`}>
          {message}
        </h4>
        {subMessage && (
          <p className="text-xs text-gray-500 font-medium">{subMessage}</p>
        )}
      </div>
    </div>
  );
 
  // Mode 1: Full-Screen Overlay (for route transitions, auth checks, initial app loads)
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center  transition-all duration-300 ">
        <div className="px-8 py-7">
          {loaderBody}
        </div>
      </div>
    );
  }

  // Mode 2: Inline Centered (for section/canvas loading)
  return (
    <div className="flex items-center justify-center w-full min-h-[320px] py-12">
      {loaderBody}
    </div>
  );
}
