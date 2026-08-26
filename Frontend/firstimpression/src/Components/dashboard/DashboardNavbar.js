import React, { useState } from 'react';
import { Bell, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import logo from "../../assets/promotional/Firstimpression_icon_logo_copy.png"; 
import { useSelector } from 'react-redux';
import { routes } from '../../routes/routes';

const tabs = ['My Resumes', 'Templates', 'ATS Score'];

const DashboardNavbar = ({ activeTab = 'My Resumes', setActiveTab }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user) || localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    if (location.pathname !== routes.DASHBOARD) {
      navigate(routes.DASHBOARD, { state: { activeTab: tab } });
    } else {
      if (setActiveTab) setActiveTab(tab);
    }
  };

  return (
    <> 
      <div className="h-[132px] md:h-20 w-full shrink-0">
        <nav 
          className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] fixed top-0 left-0 w-full z-30 shadow-sm"
          style={{ 
            paddingLeft: 'var(--auth-form-padding)', 
            paddingRight: 'var(--auth-form-padding)',
          }}
        >
          <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Logo & Tabs */}
          <div className="flex items-center gap-6 lg:gap-10">
            <div className="flex items-center gap-3 md:gap-4">
              {location.pathname !== routes.DASHBOARD && (
                <button 
                  onClick={() => navigate(routes.DASHBOARD)}
                  className="p-1.5 md:p-2 bg-[var(--bg-surface-hover)] rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--theme-red-start)] hover:border-[var(--theme-red-start)]/30 hover:bg-[var(--theme-red-start)]/10 transition-all shadow-sm flex items-center justify-center shrink-0"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2.5} />
                </button>
              )}
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(routes.DASHBOARD)}>

              <img 
                 src = {logo}
                alt="FirstImpression Logo" 
                className="h-8 sm:h-10 object-contain drop-shadow-sm mr-3" 
              />
              <div className="hidden sm:flex items-center font-bold tracking-tight text-[var(--text-primary)] text-xl sm:text-3xl">
                <span className="text-[var(--theme-red-start)]">first</span>
                <span className="ml-0.5">impression</span>
              </div>
              </div>
            </div>

            {/* Desktop Tab Slider */}
            <div className="hidden md:flex items-center bg-[var(--bg-surface-hover)]/80 p-1 rounded-full border border-[var(--border-subtle)]/50">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === tab ? 'text-[var(--text-inverse)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="nav-tab-slider"
                      className="absolute inset-0 bg-theme-red rounded-full shadow-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Icons & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
             {/* Simple Search */}
             <button className="p-2 text-[var(--text-tertiary)] hover:text-theme-red transition-colors rounded-full hover:bg-[var(--bg-surface-hover)]">
               <Search className="w-5 h-5" />
             </button>

             <button className="relative p-2 text-[var(--text-tertiary)] hover:text-theme-red transition-colors rounded-full hover:bg-[var(--bg-surface-hover)]">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-theme-red rounded-full"></span>
             </button>

            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>

            {/* Clean User Profile Trigger */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(prev => !prev);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-4 ring-theme-red-start/10 transition-all duration-200 active:scale-95 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-theme-red-start to-theme-red-end flex items-center justify-center text-[var(--text-inverse)] font-bold text-sm shadow-sm overflow-hidden">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    'U'
                  )}
                </div>
              </button>
               
              {/* Dropdown User Menu */}
              <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)}  />
            </div>
          </div>
        </div> 

        {/* Mobile Tab Slider (Visible only on small screens) */}
        <div className="md:hidden flex overflow-x-auto pb-4 hide-scrollbar gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`whitespace-nowrap px-[var(--padding-btn-x)] py-[var(--padding-btn-y)] text-sm font-medium rounded-full transition-colors ${
                activeTab === tab ? 'bg-theme-red text-[var(--text-inverse)]' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
      </div>
    </>
  );
};

export default DashboardNavbar;
