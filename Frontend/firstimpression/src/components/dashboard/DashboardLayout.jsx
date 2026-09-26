import React from 'react';
import DashboardNavbar from './DashboardNavbar';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans selection:bg-theme-red-start/20 selection:text-theme-red relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-theme-red-start/5 to-transparent pointer-events-none -z-10"></div>
      
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main 
        className="flex-1 mx-auto w-full max-w-7xl animate-in fade-in duration-500 relative z-10"
        style={{ padding: 'var(--auth-form-padding)' }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
