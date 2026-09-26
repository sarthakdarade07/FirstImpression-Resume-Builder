import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Sparkles, CheckCircle2 } from "lucide-react";
import processVideo from "../../assets/videos/first impression process.mp4";

export default function FeaturesVideoSection() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting && videoRef.current && !videoRef.current.muted) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
      },
      { threshold: 0.15 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) observer.observe(currentVideo);
    return () => {
      if (currentVideo) observer.unobserve(currentVideo);
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const steps = [
    { num: "01", title: "Select a Template", desc: "Choose an ATS layout tailored for your target industry." },
    { num: "02", title: "Upload or Paste the Job Description", desc: "Our AI extracts key skills and tailors your resume bullets." },
    { num: "03", title: "Export & Apply", desc: "Download high-resolution print-ready PDFs and start landing interviews." },
  ];

  return (
    <section id="features-video" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[var(--theme-red)] text-xs font-bold uppercase tracking-wider">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>See It In Action</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            How to use{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)]">
              FirstImpression
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            Watch how effortlessly you can import your profile, customize your template, and generate targeted job-winning resumes.
          </p>
        </div>

        {/* 3 Step Process row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
              <span className="text-2xl font-extrabold text-[var(--theme-red)] font-mono">{s.num}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Box with Ambient Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-950 group cursor-pointer"
          onClick={togglePlay}
        >
          {/* Ambient colored lighting behind video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

          <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={processVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Overlay Indicator when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
                <div className="w-16 h-16 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-2xl pl-1 hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current" />
                </div>
              </div>
            )}

            {/* Floating Control Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Product Walkthrough</span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 transition-all hover:scale-110 cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
