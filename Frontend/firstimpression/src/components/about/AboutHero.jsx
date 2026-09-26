import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Flame, Zap, ShieldCheck, Heart, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function AboutHero() {
  const navigate = useNavigate();

  const chips = [
    { icon: Flame, text: "No Cap, Pure Impact", color: "from-orange-500 to-rose-500" },
    { icon: Zap, text: "45s AI Tailoring", color: "from-amber-500 to-orange-500" },
    { icon: ShieldCheck, text: "100% ATS Approved", color: "from-emerald-500 to-teal-500" },
    { icon: Heart, text: "Loved by Job Seekers", color: "from-rose-500 to-pink-500" },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-red-50/50 via-white to-gray-50 overflow-hidden">
      {/* Dynamic ambient background gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-red-200/40 via-orange-200/30 to-rose-100/40 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50/90 border border-red-200/80 text-[var(--theme-red-hover)] font-bold text-xs sm:text-sm mb-6 shadow-xs backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-[var(--theme-red)] animate-spin-slow" />
          <span>The Modern Job Hunt Rebellion</span>
        </motion.div>

        {/* Dramatic Opening Headline with staggered entrance */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl leading-[1.12]"
        >
          We killed the boring resume.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] via-red-500 to-[var(--theme-red-end)]">
            You're welcome.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed"
        >
          Built for ambitious builders, creators, and modern tech leaders tired of 2004-era Word docs and black-hole job portals. We make your credentials look as unstoppable as you are.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(routes.TEMPLATES)}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] hover:opacity-95 text-white rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-red-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Try The Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("our-story");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full font-bold text-sm sm:text-base transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-[var(--theme-red)]" />
            <span>Read Our Origin</span>
          </button>
        </motion.div>

        {/* Floating Gen-Z Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-gray-200/70 w-full max-w-3xl flex flex-wrap justify-center items-center gap-3 sm:gap-4"
        >
          {chips.map((chip, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:border-gray-300 transition-all hover:scale-105 cursor-default"
            >
              <div className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${chip.color} text-white flex items-center justify-center shrink-0`}>
                <chip.icon className="w-3 h-3" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800">{chip.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
