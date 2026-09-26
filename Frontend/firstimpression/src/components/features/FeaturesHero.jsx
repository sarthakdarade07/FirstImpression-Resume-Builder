import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, CheckCircle2, Bot, Layers, UserCheck, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

const highlights = [
  { icon: Bot, label: "AI JD Assistant" },
  { icon: Layers, label: "Live Template Studio" },
  { icon: UserCheck, label: "1-Click Profile Sync" },
  { icon: ShieldCheck, label: "ATS Optimization" },
];

export default function FeaturesHero() {
  const navigate = useNavigate();

  const scrollToVideo = () => {
    const el = document.getElementById("features-video");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-red-50/40 via-white to-gray-50 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-20 w-[500px] h-[500px] bg-red-100 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 -ml-24 w-[400px] h-[400px] bg-orange-100 rounded-full blur-3xl opacity-40 pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/70 text-[var(--theme-red-hover)] font-semibold text-xs sm:text-sm mb-6 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[var(--theme-red)]" />
          <span>Next-Gen Career Tools</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl leading-[1.15]"
        >
          Built for speed, designed for impact,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)]">
            powered by AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed"
        >
          Every tool you need to transform your experience into an interview magnet.
          Explore the intelligent features crafted to get your resume noticed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(routes.TEMPLATES)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] hover:opacity-95 text-white rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-red-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Templates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={scrollToVideo}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full font-bold text-sm sm:text-base transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-[var(--theme-red)] fill-current" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Quick feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-gray-200/70 w-full max-w-3xl flex flex-wrap justify-center items-center gap-3 sm:gap-6"
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-xs text-xs font-semibold text-gray-700"
            >
              <item.icon className="w-4 h-4 text-[var(--theme-red)]" />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
