import React from "react";
import { motion } from "framer-motion";
import { Sparkles, XCircle, CheckCircle2, Skull, Rocket, Coffee, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function AboutStorySection() {
  const navigate = useNavigate();

  return (
    <section id="our-story" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5" />
            <span>The Origin Story</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Born out of pure rage against{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">
              broken job portals
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Ever spent 3 hours aligning margins in Word, only to export to PDF and have your bullet points jump across 3 pages? Or applied to 50 jobs and got auto-rejected by a dumb bot at 3:15 AM? Yeah, us too.
          </p>
        </div>

        {/* Side-by-side: The Old Way vs The FirstImpression Way */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Old Way Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gray-50 border border-gray-200 p-8 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5" /> The Old Way
                </span>
                <span className="text-xs text-gray-400 font-mono">pain level: 100%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Generic, slow & invisible</h3>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>One generic PDF sent to 100 completely different job openings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Invisible to ATS parsers due to messy tables, icons, and weird margins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Hours spent copy-pasting your work history over and over.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-800 font-semibold">
              Result: 2% callback rate and endless ghosting.
            </div>
          </motion.div>

          {/* FirstImpression Way Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 border border-gray-800 text-white p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tr from-rose-500/20 to-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" /> The FirstImpression Way
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">3.4x interview boost</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Targeted, automated & unstoppable</h3>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>AI tailors your resume bullets to match any Job Description in 45 seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% compliant with enterprise ATS screeners like Workday and Greenhouse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>One-click profile auto-sync: change templates instantly without re-typing.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-gray-800/80 border border-gray-700/80 text-xs text-emerald-400 font-semibold flex items-center justify-between relative z-10">
              <span>Result: Real recruiters booking real interviews on your calendar.</span>
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
