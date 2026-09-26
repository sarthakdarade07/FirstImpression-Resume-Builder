import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Palette, Lock, Sparkles, HeartHandshake } from "lucide-react";

export default function AboutValuesSection() {
  const values = [
    {
      icon: Zap,
      title: "Fast As Light, Zero Fluff",
      desc: "We respect your time. No 20-step onboarding quizzes or forced questionnaires. Open the studio, edit live, and export immediately.",
      color: "from-amber-500 to-orange-500",
      border: "border-amber-200/60"
    },
    {
      icon: ShieldCheck,
      title: "Ruthless ATS Engineering",
      desc: "Pretty templates that break ATS parsers are useless. We test our markup against standard industry screeners so your text is always 100% extractable.",
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-200/60"
    },
    {
      icon: Palette,
      title: "Design Obsessed",
      desc: "Engineered with aesthetic rigor. Clean typography, deliberate hierarchy, and proportioned margins that make hiring managers stop and read.",
      color: "from-rose-500 to-red-600",
      border: "border-rose-200/60"
    },
    {
      icon: Lock,
      title: "Your Data Belongs To You",
      desc: "No selling your resume to random recruiters. Your master profile details, tailored resumes, and job history are encrypted and private.",
      color: "from-blue-500 to-indigo-600",
      border: "border-blue-200/60"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[var(--theme-red)] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Our Core Playbook</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            The principles we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)]">
              refuse to compromise
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            We don't build software to sell you resume subscriptions you forget to cancel. We build high-leverage tools that get you hired.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`bg-white rounded-3xl p-8 border ${v.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${v.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--theme-red)] transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-mono font-medium">
                <span>rule #{i + 1}</span>
                <span className="text-gray-900 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Non-negotiable
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
