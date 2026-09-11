import React from "react";
import { Sparkles, ArrowRight, FileText, Target, Briefcase, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroVideo from "../../assets/videos/firstimpression-hero_video.webm";
import { routes } from "../../routes/routes";

export default function Hero({ isSplashFinished = true }) {
  const navigate = useNavigate();
  const features = [
    { icon: <Zap className="w-5 h-5 text-[var(--theme-red)]" />, text: "Lightning Fast" },
    { icon: <Target className="w-5 h-5 text-[var(--theme-red)]" />, text: "ATS-Friendly" },
    { icon: <Briefcase className="w-5 h-5 text-[var(--theme-red)]" />, text: "Professional Templates" },
  ];
 
  // A high-quality placeholder video related to work/resume (Pixabay/Mixkit fallback)
  const videoUrl = HeroVideo;

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden md:pt-24 flex items-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-[var(--theme-red-light)] rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-red-100 rounded-full blur-3xl opacity-40 z-0"></div>

      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-8 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Text Content (Slides from left to right) */}
          <motion.div 
            initial={false}
            animate={
              isSplashFinished 
                ? { opacity: 1, x: 0 } 
                : { opacity: 0, x: -150 }
            }
            transition={{ duration: 1, delay: isSplashFinished ? 0.4 : 0, type: "spring", stiffness: 60, damping: 15 }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-50 border border-red-100 text-[var(--theme-red-hover)] font-medium text-sm mb-6">
              <Sparkles size={16} />
              <span>The #1 AI Resume Builder</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6">
              Craft your perfect resume and make a lasting <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)]">first impression</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
              Your career journey starts here. Build professional, beautifully designed, and recruiter-approved resumes in just minutes. Stand out from the crowd and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate(routes.SIGNUP)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Build My Resume
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate(routes.TEMPLATES)}
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText size={20} className="text-gray-500" />
                View Templates
              </button>
            </div>

            {/* Feature Icons */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center lg:justify-start gap-6 sm:gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className="font-medium text-gray-500">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Video Content (Starts centered and zoomed, moves to right) */}
          <motion.div 
            initial={false}
            animate={
              isSplashFinished 
                ? { scale: 1, x: 0, opacity: 1 } 
                : { scale: 1.2, x: "-50%", opacity: 0.99 } // Reduced scale slightly for portrait
            }
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-12 lg:mt-0"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-md xl:max-w-[440px]">
              {/* Decorative abstract elements behind video */}
              <div className="absolute top-10 -left-10 w-32 h-32 sm:w-48 sm:h-48 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
              <div className="absolute top-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
              
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="relative z-10 w-full aspect-[3/4] sm:aspect-[9/16] lg:aspect-[9/16] rounded-[2rem] shadow-2xl border border-white/50 object-cover"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
              
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}