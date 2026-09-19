import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function FeaturesCta() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-24 bg-gray-900 relative overflow-hidden text-white">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/30 to-orange-500/20 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-300 font-semibold text-xs sm:text-sm mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Start Building Free Today</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight"
        >
          Ready to build your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
            winning resume?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed"
        >
          Join job seekers worldwide who use FirstImpression to pass ATS screeners and impress hiring managers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(routes.SIGNUP)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] hover:opacity-95 text-white rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-red-500/30 transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create My Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(routes.TEMPLATES)}
            className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-sm sm:text-base backdrop-blur-md transition-colors cursor-pointer"
          >
            Browse All Templates
          </button>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free to get started
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant ATS export
          </span>
        </div>
      </div>
    </section>
  );
}
