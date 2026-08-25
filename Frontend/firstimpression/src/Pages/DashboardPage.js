import React, { useState } from 'react';
import { Plus, FileText, MoreVertical, LayoutTemplate, ShieldCheck, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'My Resumes');
  const user = useSelector((state) => state.auth.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }
  };

  // Get current date string
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-10 pb-16 pt-6">
        
        {/* Minimalist Sleek Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-theme-red font-semibold text-sm mb-2 tracking-wide uppercase">{currentDate}</p>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name ? user.name.split(' ')[0] : 'Creator'}.
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Here is what's happening with your job applications today.
            </p>
          </motion.div>
        </div>

        {/* Stats Section - Clean & Monochromatic */}
        {activeTab === 'My Resumes' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { label: 'Total Resumes', value: '3', icon: FileText },
              { label: 'Profile Views', value: '124', icon: Users, trend: '+12% this week' },
              { label: 'Avg. ATS Score', value: '86%', icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-gray-400">
                    <stat.icon strokeWidth={1.5} className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <h4 className="text-gray-500 text-sm font-medium">{stat.label}</h4>
                    {stat.trend && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dynamic Content Area */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Resumes</h2>
          </motion.div>
          
          {/* Content: My Resumes */}
          {activeTab === 'My Resumes' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              
              {/* Ultra-minimal 'Create New' Button */}
              <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group flex flex-col items-center justify-center gap-4 h-[260px] rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-white hover:border-theme-red/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-theme-red transition-colors" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-gray-900 text-lg mb-1">
                    Create New
                  </span>
                  <span className="text-sm text-gray-500">Start from a blank canvas</span>
                </div>
              </motion.button>

              {/* Elegant Resume Cards */}
              {['Software Engineer', 'Product Manager'].map((title, idx) => (
                <motion.div 
                  variants={itemVariants}
                  key={idx} 
                  className="group relative flex flex-col h-[260px] rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 p-6 overflow-hidden cursor-pointer"
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-theme-red/5 transition-colors">
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-theme-red transition-colors" strokeWidth={1.5} />
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="mt-auto">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-theme-red transition-colors">{title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                      Updated 2 days ago
                    </div>
                  </div>

                  {/* Subtle Hover Action */}
                  <div className="absolute right-6 bottom-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                     <div className="w-10 h-10 rounded-full bg-theme-red text-white flex items-center justify-center shadow-lg">
                       <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Content: Templates */}
          {activeTab === 'Templates' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <LayoutTemplate strokeWidth={1.5} className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Template Gallery</h3>
              <p className="text-gray-500 max-w-sm text-lg">
                Explore our curated collection of professional and elegant templates.
              </p>
            </motion.div>
          )}

          {/* Content: ATS Score */}
          {activeTab === 'ATS Score' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <ShieldCheck strokeWidth={1.5} className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">ATS Analyzer</h3>
              <p className="text-gray-500 max-w-sm text-lg">
                Ensure your resume passes applicant tracking systems with flying colors.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
