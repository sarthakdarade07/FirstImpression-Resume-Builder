import React, { useState, useEffect } from 'react';
import { Plus, FileText, MoreVertical, LayoutTemplate, ShieldCheck, TrendingUp, Users, Clock, ArrowRight, Eye, Check, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useSelector } from 'react-redux';
import { routes } from '../routes/routes';
import { templateApi } from '../components/templates/services/templateApi';
import { fallbackTemplates } from '../components/templates/data/localTemplates';
import { resumeApi } from '../services/resumeApi';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'My Resumes');
  const [templatesList, setTemplatesList] = useState(fallbackTemplates);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [creatingForSlug, setCreatingForSlug] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const loadResumes = async () => {
    setLoadingResumes(true);
    try {
      const resumes = await resumeApi.getUserResumes();
      setUserResumes(resumes || []);
    } catch (e) {
      console.warn('Failed to load user resumes:', e);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadTemplates() {
      setLoadingTemplates(true);
      try {
        const list = await templateApi.getTemplates();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setTemplatesList(list);
        }
      } catch (err) {
        console.warn('Failed to load templates in Dashboard:', err);
      } finally {
        if (isMounted) setLoadingTemplates(false);
      }
    }
    loadTemplates();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUseTemplate = async (tpl) => {
    setCreatingForSlug(tpl.slug);
    try {
      const created = await resumeApi.createResumeFromTemplate(tpl);
      // Immediately open in full view editor with the created resume
      navigate(`${routes.TEMPLATES}?template=${tpl.slug}&resumeId=${created.id}&edit=true`);
    } catch (err) {
      console.error('Failed to create resume:', err);
    } finally {
      setCreatingForSlug(null);
    }
  };

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeApi.deleteResume(id);
      await loadResumes();
      setToastMessage('Resume deleted.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  const categories = ['All', ...new Set(templatesList.map((t) => t.category).filter(Boolean))];
  const filteredTemplates =
    selectedCategory === 'All'
      ? templatesList
      : templatesList.filter((t) => t.category === selectedCategory);

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
              { label: 'Total Resumes', value: userResumes.length.toString(), icon: FileText },
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
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {activeTab === 'Templates'
                  ? 'Resume Templates'
                  : activeTab === 'ATS Score'
                  ? 'ATS Resume Checker'
                  : 'My Resumes'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'Templates'
                  ? 'Choose from our curated collection of professional, ATS-optimized resume layouts.'
                  : activeTab === 'ATS Score'
                  ? 'Analyze your resume against job descriptions for maximum ATS reach.'
                  : 'Create, customize, and manage your personal resumes.'}
              </p>
            </div>

            {activeTab === 'Templates' && (
              <div className="flex items-center gap-3">
                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`${routes.TEMPLATES}?preview=true`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-theme-red hover:bg-theme-red/90 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
                onClick={() => setActiveTab('Templates')}
                className="group flex flex-col items-center justify-center gap-4 h-[260px] rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-white hover:border-theme-red/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-theme-red transition-colors" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-gray-900 text-lg mb-1">
                    Create New
                  </span>
                  <span className="text-sm text-gray-500">Pick a template to start</span>
                </div>
              </motion.button>

              {/* Real User Resumes List */}
              {userResumes.map((resume, idx) => (
                <motion.div 
                  variants={itemVariants}
                  key={resume.id || idx} 
                  onClick={() => navigate(`${routes.TEMPLATES}?template=${resume.templateSlug}&resumeId=${resume.id}&edit=true`)}
                  className="group relative flex flex-col h-[260px] rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 p-6 overflow-hidden cursor-pointer"
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-theme-red/5 transition-colors">
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-theme-red transition-colors" strokeWidth={1.5} />
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => handleDeleteResume(e, resume.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="mt-auto">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-theme-red mb-2">
                      {resume.templateSlug?.replace('-', ' ') || 'Template'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-theme-red transition-colors">
                      {resume.title || 'My Resume'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                      {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>

                  {/* Hover Action */}
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
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTemplates.map((tpl, idx) => {
                const isCreating = creatingForSlug === tpl.slug;
                return (
                  <motion.div
                    variants={itemVariants}
                    key={tpl.slug || idx}
                    className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
                  >
                    {/* Visual Preview / Thumbnail Area */}
                    <div className="relative h-64 bg-slate-100 overflow-hidden border-b border-gray-100 flex items-center justify-center p-4">
                      {tpl.thumbnailUrl ? (
                        <img 
                          src={tpl.thumbnailUrl} 
                          alt={tpl.name}
                          className="w-full h-full object-cover object-top rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-slate-100 rounded w-full"></div>
                            <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                          </div>
                        </div>
                      )}

                      {/* Overlay Action Buttons on Hover */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => navigate(`${routes.TEMPLATES}?template=${tpl.slug}&preview=true`)}
                          className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-theme-red" />
                          Preview
                        </button>
                        <button
                          type="button"
                          disabled={isCreating}
                          onClick={() => handleUseTemplate(tpl)}
                          className="px-4 py-2 bg-theme-red text-white text-xs font-bold rounded-xl shadow-lg hover:bg-theme-red/90 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Use Template
                            </>
                          )}
                        </button>
                      </div>

                      {/* Badges on Top */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm">
                          {tpl.category || 'General'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm">
                          ATS Friendly
                        </span>
                      </div>
                    </div>

                    {/* Card Content Footer */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-theme-red transition-colors">
                          {tpl.name}
                        </h3>
                        <span className="text-xs text-gray-400 capitalize font-medium">
                          {tpl.layoutType?.replace('_', ' ') || 'standard'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {tpl.description || 'A modern, ATS-optimized layout crafted for maximum readability.'}
                      </p>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Ready to Use
                        </span>
                        <button
                          type="button"
                          disabled={isCreating}
                          onClick={() => handleUseTemplate(tpl)}
                          className="text-xs font-bold text-theme-red hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-70"
                        >
                          {isCreating ? 'Adding...' : 'Use this template'} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
