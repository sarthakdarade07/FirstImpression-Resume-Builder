import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, CheckCircle2, Zap, ArrowRight, Target, BrainCircuit, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function AiTailoringSection() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: FileSearch,
      title: "Smart JD Keyword Extraction",
      desc: "Paste any job posting or upload a description. Our AI instantly parses required competencies, tools, and responsibilities."
    },
    {
      icon: BrainCircuit,
      title: "Targeted Resume Tailoring",
      desc: "Automatically aligns your experience bullets, projects, and skills to highlight exactly what that specific recruiter is hunting for."
    },
    {
      icon: Target,
      title: "ATS Match Booster",
      desc: "Identifies keyword gaps and injects high-impact terminology so your resume breezes past automated screening software."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Descriptions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Job Assistant</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Tailor your resume for every job in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-rose-600">
                under 30 seconds
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Applying to jobs with a generic resume is the #1 reason applicants get rejected.
              Our AI Assistant compares your resume against the target Job Description, identifies missing competencies, and tailors your profile with surgical precision.
            </p>

            <div className="space-y-4 pt-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center shrink-0 text-[var(--theme-red)]">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{b.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`${routes.RESUME}?preview=true`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-102 cursor-pointer"
              >
                <span>Try JD Tailoring in Studio</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Visual Mock Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-gray-800 overflow-hidden">
              {/* Background gradient decorative glow */}
              <div className="absolute -top-16 -right-16 w-60 h-60 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Analysis</div>
                    <div className="text-sm sm:text-base font-bold text-white">Full Stack Engineer @ Stripe</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>96% ATS Match</span>
                </div>
              </div>

              {/* Mock Extracted Skills */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-2">Detected JD Keywords & Requirements</div>
                  <div className="flex flex-wrap gap-2">
                    {["React.js", "Java Spring Boot", "PostgreSQL", "REST APIs", "CI/CD", "AWS", "Microservices"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Tailored Snippet Box */}
                <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-orange-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Tailored Experience Bullet
                    </span>
                    <span className="text-emerald-400 font-semibold text-[11px]">+32% Recruiter Impact</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    "Architected high-throughput REST APIs using Spring Boot and PostgreSQL, scaling payment event processing by 40% while reducing latency across distributed microservices."
                  </p>
                </div>

                {/* Action button */}
                <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>? Automatically synced with active template</span>
                  <span className="text-gray-500 font-mono text-[11px]">latency: 1.2s</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
