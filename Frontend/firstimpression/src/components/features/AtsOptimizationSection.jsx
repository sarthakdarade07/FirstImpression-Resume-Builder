import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Printer, FileText, CheckCircle2, TrendingUp, Layers } from "lucide-react";

export default function AtsOptimizationSection() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Recruiter Software Compliant",
      desc: "Every template is engineered to parse cleanly through Workday, Taleo, Greenhouse, and Lever without garbled tables or lost contact info.",
      stat: "100%",
      statLabel: "Parser Pass Rate"
    },
    {
      icon: Printer,
      title: "Pixel-Perfect PDF & Print",
      desc: "Built-in dedicated print styling ensures that what you see on your screen is formatted without awkward page breaks or clipped borders.",
      stat: "A4 / Letter",
      statLabel: "Standard Formats"
    },
    {
      icon: Layers,
      title: "Multiple Targeted Versions",
      desc: "Keep multiple tailored variants in your dashboard. Submit one resume for startup roles and another specialized for enterprise applications.",
      stat: "Unlimited",
      statLabel: "Saved Resumes"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Built For Results</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Designed to beat the bot and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              impress the recruiter
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            More than 75% of resumes are discarded by ATS scanners before a human ever lays eyes on them. FirstImpression bridges the gap between machine readability and executive visual polish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                  <c.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{c.stat}</div>
                  <div className="text-xs text-gray-400 font-semibold">{c.statLabel}</div>
                </div>
                <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
