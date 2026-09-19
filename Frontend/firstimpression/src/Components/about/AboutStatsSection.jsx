import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, Award } from "lucide-react";

export default function AboutStatsSection() {
  const metrics = [
    { num: "1000+", label: "Resumes Built", sub: "and counting globally", icon: Users },
    { num: "3.4x", label: "Callback Boost", sub: "over generic resumes", icon: TrendingUp },
    { num: "45s", label: "Average Tailor Speed", sub: "using AI Job Assistant", icon: Clock },
    { num: "99.8%", label: "ATS Pass Rate", sub: "verified across scanners", icon: Award },
  ];

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-gray-800 relative overflow-hidden">
          {/* Ambient colored lighting behind card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-[100px] pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none -z-0" />

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
            <span className="text-orange-400 font-mono text-xs font-bold uppercase tracking-wider">
              By The Numbers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Results that speak louder than words
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white flex items-center justify-center mb-1 shadow-sm">
                  <m.icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans">
                  {m.num}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-200">{m.label}</div>
                <div className="text-[11px] text-gray-400">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
