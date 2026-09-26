import React from "react";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Eye,
  Smartphone,
  RefreshCw,
  ArrowRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { routes } from "../../routes/routes";

export default function TemplateStudioSection() {
  const navigate = useNavigate();

 

  const templates = [
    {
      name: "Professional sidebar",
      img:"https://res.cloudinary.com/avju5bm0/image/upload/v1790009809/Screenshot_2026-09-21_222634_ewcyxh.png",
      desc: "Sleek dual-column layout with bold visual hierarchy.",
      slug: "professional-sidebar",
    },
    {
      name: "Classic ATS",
      img:  "https://res.cloudinary.com/avju5bm0/image/upload/v1790009619/Screenshot_2026-09-21_222124_eu6xy0.png",
      desc: "Traditional top-down structure prioritized for corporate roles.",
      slug: "classic-ats-professional",
    },
    {
      name: "Elegant Resume",
      img: "https://res.cloudinary.com/avju5bm0/image/upload/v1790009923/Screenshot_2026-09-21_222833_u17crv.png",
      desc: "High-density layout designed for engineers and developers.",
      slug: "elegant-resume",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[var(--theme-red)] text-xs font-bold uppercase tracking-wider">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Interactive Studio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Dynamic templates with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)]">
              live visual preview
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            Switch styles on the fly without losing a single line of your
            content. Type in the dedicated editor drawer and see changes update
            immediately on your screen.
          </p>
        </div>

        {/* Feature Grid with Template Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col">
              <div className="relative h-64 bg-slate-100 overflow-hidden border-b border-gray-100 flex items-center justify-center p-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover object-top rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    onClick={() =>
                      navigate(
                        `${routes.RESUME}?template=${t.slug}&preview=true`,
                      )
                    }
                    className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-xl shadow-md hover:bg-gray-50 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer">
                    <Eye className="w-3.5 h-3.5 text-[var(--theme-red)]" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[var(--theme-red)] transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} /> ATS
                    Friendly
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Studio Perks row */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-700 font-semibold">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[var(--theme-red)]" />
              <span>Instant Template Hot-Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--theme-red)]" />
              <span>Responsive Phone Slide-Over Drawer</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--theme-red)]" />
              <span>Pixel-Accurate Print Canvas</span>
            </div>
          </div>
          <button
            onClick={() => navigate(routes.TEMPLATES)}
            className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs sm:text-sm font-bold transition-transform hover:scale-102 cursor-pointer">
            <span>Open Template Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
