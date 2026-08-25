import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Menu, X, Layers } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

/**
 * SidebarPageLayout
 * A generalized, reusable 2-column layout with:
 * - Desktop: Sticky sidebar with dedicated scrollbar (.sidebar-scrollbar)
 * - Mobile: Slide-out drawer on click with click-outside-to-close behavior
 * - Dedicated content card scrollbar (.content-scrollbar)
 * - Enhanced larger tab sizes and active indicators
 * - Consistent user profile card & section headers
 */
const SidebarPageLayout = ({
  title,
  subtitle,
  headerAction,
  sections = [],
  activeTab,
  setActiveTab,
  user,
  sidebarTop,
  children,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Find active item info for the mobile toggle bar
  const activeItem = sections
    .flatMap((s) => s.items)
    .find((item) => item.id === activeTab);

  const renderSidebarItem = (item, isMobile = false) => {
    const { id, label, icon: Icon, badge } = item;
    const isActive = activeTab === id;

    return (
      <button
        key={id}
        onClick={() => {
          setActiveTab(id);
          if (isMobile) {
            setIsMobileDrawerOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 text-[15px] sm:text-base font-semibold group ${
          isActive
            ? 'bg-white text-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-200/80 font-bold'
            : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {Icon && (
            <div
              className={`p-1.5 rounded-xl transition-colors flex-shrink-0 ${
                isActive
                  ? 'bg-[var(--theme-red)]/10 text-[var(--theme-red)]'
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[var(--theme-red)]' : 'currentColor'} />
            </div>
          )}
          <span className="truncate">{label}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              {badge}
            </span>
          )}
          {isActive && (
            <div className="w-1.5 h-5 bg-[var(--theme-red)] rounded-full mr-0.5" />
          )}
        </div>
      </button>
    );
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="space-y-6">
      {/* Custom or Default User Profile Card */}
      {sidebarTop !== undefined ? (
        sidebarTop
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:border-gray-300 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--theme-red-start)] to-[var(--theme-red-end)] flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-sm flex-shrink-0">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate leading-tight">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {user?.email || 'Settings'}
              </p>
            </div>
          </div>
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-2" />
        </div>
      )}

      {/* Sidebar Navigation Sections */}
      {sections.map((section, idx) => (
        <div key={section.title || idx}>
          {section.title && (
            <h4 className="px-3 text-xs font-bold text-gray-400/90 uppercase tracking-wider mb-2.5">
              {section.title}
            </h4>
          )}
          <div className="space-y-1.5">
            {section.items.map((item) => renderSidebarItem(item, isMobile))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen py-2">
        <div className="max-w-6xl mx-auto">
          {/* Optional Page Header */}
          {(title || subtitle || headerAction) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                {title && (
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-slate-500 mt-1.5 text-base font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && <div>{headerAction}</div>}
            </motion.div>
          )}

          {/* Mobile Section Selector Bar (Visible ONLY on Mobile < md) */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200/80 rounded-2xl shadow-sm text-left active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-[var(--theme-red)]/10 text-[var(--theme-red)] rounded-xl">
                  {activeItem?.icon ? <activeItem.icon size={18} /> : <Layers size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Section</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {activeItem?.label || 'Select Section'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors">
                <Menu size={14} />
                <span>Switch</span>
              </div>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            {/* Desktop Sidebar Column (Sticky, visible on md+) */}
            <div className="hidden md:block w-[270px] lg:w-[280px] flex-shrink-0">
              <div className="sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto pr-1 sidebar-scrollbar">
                {renderSidebarContent(false)}
              </div>
            </div>

            {/* Right Main Content Card with dedicated content-scrollbar */}
            <div className="flex-1 w-full min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[28px] border border-gray-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden min-h-[520px]"
                >
                  <div className="px-5 py-6 sm:px-10 sm:py-10 max-h-[calc(100vh-140px)] overflow-y-auto content-scrollbar">
                    {children}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer (Visible when isMobileDrawerOpen is true) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop: Clicking outside the slider closes it */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-[300px] max-w-[85vw] h-full bg-gray-50/95 backdrop-blur-xl z-10 shadow-2xl flex flex-col border-r border-gray-200/80"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-200/80 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--theme-red)]" />
                  <span className="font-bold text-gray-900 text-base">Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Drawer Content */}
              <div className="p-4 flex-1 overflow-y-auto sidebar-scrollbar">
                {renderSidebarContent(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default SidebarPageLayout;
