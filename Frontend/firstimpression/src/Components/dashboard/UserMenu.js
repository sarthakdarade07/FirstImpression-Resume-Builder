import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { routes } from '../../routes/routes';
import { logout } from '../../redux/slices/authslice';

const UserMenu = ({ isOpen, onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const user = useSelector((state) => state.auth.user) || localStorage.getItem('jwtToken');

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    navigate(routes.SIGNIN, { replace: true });
  };

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col z-50 overflow-hidden"
          style={{ maxHeight: "50vh" }}>
          {/* Header Profile Section */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-red-start to-theme-red-end flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {user ? user.name || "Guest User" : "Loading..."}
                </h3>
                <p className="text-[11px] text-theme-red font-semibold uppercase tracking-wider mt-0.5">
                  {user ? user.subscriptionPlan || "Free Plan" : "..."}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Links Area */}
          <div className="flex-1 overflow-y-auto p-2 menu-scrollbar">
            {[
              {
                icon: User,
                label: "My Profile",
                desc: "Personal details & info",
                action: () => { onClose(); navigate(routes.PROFILE); }
              },
              {
                icon: FileText,
                label: "My Resumes",
                desc: "Manage your documents",
              },
              {
                icon: Settings,
                label: "Account Settings",
                desc: "Preferences & security",
                action: () => { onClose(); navigate(routes.ACCOUNT); }
              },
              {
                icon: HelpCircle,
                label: "Help & Support",
                desc: "FAQs and contact",
              },
              {
                icon: FileText,
                label: "More Option 1",
                desc: "Just for scrolling",
              },
              {
                icon: FileText,
                label: "More Option 2",
                desc: "Just for scrolling",
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="flex w-full items-center justify-between p-2.5 hover:bg-[var(--theme-red-start)]/10 rounded-xl transition-all duration-200 text-left group mb-1 last:mb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--theme-red-start)]/5 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-[var(--theme-red-start)]/20 transition-all">
                    <item.icon className="w-4 h-4 text-gray-500 group-hover:text-[var(--theme-red-start)] transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-[var(--theme-red-start)] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[var(--theme-red-start)] transition-colors group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>

          {/* Footer Action Area */}
          <div className="p-2 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-2.5 text-gray-500 hover:text-white hover:bg-[var(--theme-red)] rounded-xl transition-all text-sm font-semibold shadow-sm border border-transparent hover:shadow-md hover:shadow-[var(--theme-red)]/20 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
