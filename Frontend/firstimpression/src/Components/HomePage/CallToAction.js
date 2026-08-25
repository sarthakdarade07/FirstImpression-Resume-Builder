import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes/routes';

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-[1024px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 sm:p-16 text-center shadow-2xl"
        >
          {/* Inner ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-b from-[var(--theme-red)] to-transparent opacity-20 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white font-medium text-sm mb-8 border border-white/20 backdrop-blur-md">
              <CreditCard size={16} className="text-yellow-400" />
              <span>No credit card required</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Ready to build your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
                dream resume?
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of successful job seekers. Start for free today and create a professional, recruiter-approved resume in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate(routes.SIGNUP)}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white rounded-full font-semibold text-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start for Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
