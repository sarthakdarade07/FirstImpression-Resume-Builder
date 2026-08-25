import React from 'react';
import { motion } from 'framer-motion';
import { FileText, LayoutTemplate, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Resume1 from '../../assets/images/reume/reume-1.webp';
import Resume2 from '../../assets/images/reume/reume-2.webp';
import Resume3 from '../../assets/images/reume/reume-3.webp';
import Resume4 from '../../assets/images/reume/reume-4.webp';
import { routes } from '../../routes/routes';

const Template = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 z-0"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Side: Content */}
          <div className="lg:w-1/2 space-y-8">
          
            
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15]">
              You're not getting rejected because you lack talent.
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-500 leading-relaxed">
              You're getting overlooked because your resume isn't showcasing your true potential. 
              Our expertly designed layouts ensure your achievements get noticed by recruiters.
            </motion.p>
            
            <motion.div variants={itemVariants} className="pt-4 flex flex-col space-y-4">
              <div className="flex items-center text-gray-500 font-medium">
                <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                <span>Professionally designed structures</span>
              </div>
              <div className="flex items-center text-gray-500 font-medium">
                <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                <span>ATS-optimized formatting</span>
              </div>
              <div className="flex items-center text-gray-500 font-medium">
                <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
                <span>Industry-specific layouts</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Explore professional templates for resume
              </h3>
              <p className="text-gray-500 mb-8">
                Choose from dozens of expertly crafted templates designed to help you land your dream job faster.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Resumes & Button */}
          <div className="lg:w-1/2 w-full flex flex-col relative pt-10 lg:pt-0">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-pink-50 transform sm:rotate-3 sm:rounded-[3rem] opacity-50 -z-10"></div>
            
            <div className="relative flex flex-col sm:flex-row gap-6 items-start pb-10 w-full">
              
              {/* Left Column (Card 1 & Card 3) */}
              <div className="flex flex-col gap-6 w-full sm:w-1/2">
                {/* Resume 1 */}
                <motion.div 
                  variants={itemVariants} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                >
                  <div className="h-40 bg-gray-50 border-b border-gray-100 overflow-hidden">
                    <img src={Resume1} alt="Minimalist Resume" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Minimalist</span>
                    <LayoutTemplate className="w-5 h-5 text-[var(--theme-red)]" />
                  </div>
                </motion.div>

                {/* Resume 3 */}
                <motion.div 
                  variants={itemVariants} 
                  className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                >
                  <div className="h-32 bg-gray-50 border-b border-gray-100 overflow-hidden">
                    <img src={Resume3} alt="Creative Resume" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Creative</span>
                    <FileText className="w-5 h-5 text-[var(--theme-red)]" />
                  </div>
                </motion.div>
              </div>

              {/* Right Column (Card 2 and 4) */}
              <div className="flex flex-col gap-6 w-full sm:w-1/2 sm:mt-16">
                {/* Resume 2 */}
                <motion.div 
                  variants={itemVariants} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                >
                  <div className="h-48 bg-gray-50 overflow-hidden">
                    <img src={Resume2} alt="Professional Resume" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Professional</span>
                    <Briefcase className="w-5 h-5 text-[var(--theme-red)]" />
                  </div>
                </motion.div>
                
                {/* Resume 4 */}
                <motion.div 
                  variants={itemVariants} 
                  className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                >
                  <div className="h-36 bg-gray-50 overflow-hidden">
                    <img src={Resume4} alt="Executive Resume" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Executive</span>
                    <LayoutTemplate className="w-5 h-5 text-[var(--theme-red)]" />
                  </div>
                </motion.div>
              </div>

            </div>

            <motion.div variants={itemVariants} className=" flex justify-center w-full">
              <button 
                onClick={() => navigate(routes.TEMPLATES)}
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] border border-transparent rounded-full hover:shadow-lg hover:shadow-red-500/30 transform focus:outline-none"
              >
                Walk through more
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Template;
