import React from "react";
import { motion } from "framer-motion";
import { UserCheck, ArrowRight, CheckCircle2, ShieldCheck, Database, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function ProfileSyncSection() {
  const navigate = useNavigate();

  const syncPoints = [
    "Work experiences, dates, and achievements automatically mapped",
    "Educations, GPAs, and certifications pre-populated",
    "Categorized technical skills and spoken languages injected seamlessly",
    "Personal contact details, GitHub, and LinkedIn synced with 1 click"
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          {/* Right Column: Descriptions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Smart Profile Sync</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Type your career history once.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Use it across every resume.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Stop copying and pasting your work history across messy Word docs. Manage your master credentials in your FirstImpression profile. Whenever you pick a template, your complete resume is generated instantly.
            </p>

            <ul className="space-y-3 pt-2">
              {syncPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                onClick={() => navigate(routes.PROFILE)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-102 cursor-pointer"
              >
                <span>Set Up Your Master Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Left Column: Visual Sync Flow Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl space-y-6">
              {/* Step 1 Profile Source */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200/70 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase">Master Record</div>
                    <div className="text-sm font-bold text-gray-900">Your Account Profile</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Single Source of Truth
                </span>
              </div>

              {/* Animated Sync Indicator */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs text-xs font-bold text-emerald-700 animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Instant 1-Click Transformation</span>
                </div>
              </div>

              {/* Step 2 Generated Resume Target */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200/70 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-semibold uppercase">Generated Output</div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Fully Formatted & Ready
                  </span>
                </div>

                <div className="space-y-2 pt-1 font-mono text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between border-b border-gray-200/60 pb-1">
                    <span className="font-semibold text-gray-800">Sarah Jenkins</span>
                    <span className="text-gray-400">Senior Product Designer</span>
                  </div>
                  <div className="text-[10px] text-gray-500 flex gap-3">
                    <span>? sarah@example.com</span>
                    <span>?? San Francisco, CA</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    <span>? 6+ Yrs Experience • Figma, Prototyping, Design Systems</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
