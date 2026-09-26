import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function AboutCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-[var(--theme-red)] font-bold text-xs sm:text-sm mb-6"
        >
          <Rocket className="w-4 h-4 text-[var(--theme-red)]" />
          <span>Your Career Level Up Starts Here</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl leading-tight"
        >
          Stop getting ghosted.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] via-red-500 to-[var(--theme-red-end)]">
            Start getting hired.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed"
        >
          Your next big opportunity shouldn't be held back by an outdated resume. Put FirstImpression in your corner and walk into every application with full confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(routes.TEMPLATES)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] hover:opacity-95 text-white rounded-full font-bold text-sm sm:text-base shadow-xl hover:shadow-red-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch The Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(routes.SIGNUP)}
            className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-full font-bold text-sm sm:text-base transition-colors shadow-xs cursor-pointer"
          >
            Create Free Account
          </button>
        </motion.div>

        <div className="mt-12 flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          <span>for ambitious job seekers everywhere.</span>
        </div>
      </div>
    </section>
  );
}
