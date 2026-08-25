import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../components/authPage/Login";
import SignUp from "../components/authPage/SignUp";
import ForgotPassword from "../components/authPage/ForgotPassword";
import OtpVerification from "../components/authPage/OtpVerification";
import ChangePassword from "../components/authPage/ChangePassword";
import SuccessToast from "../components/notifications/SuccessToast";
import { routes } from "../routes/routes";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  
  const getView = () => {
    const path = location.pathname;
    if (path === routes.SIGNUP) return "signup";
    if (path === routes.FORGOT_PASSWORD) return "forgotPassword";
    if (path === routes.OTP) return "otp";
    if (path === routes.CHANGE_PASSWORD) return "changePassword";
    return "login";
  };
  
  const currentView = getView();

  // State to pass between forgot password steps
  // We can initialize from location state if navigated with state, or fallback to local state
  const [resetEmail, setResetEmail] = useState(location.state?.email || "");
  const [resetToken, setResetToken] = useState(location.state?.token || "");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("verified") === "true") {
      setShowToast(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  return (
    // We make this relative and hidden overflow so the animations don't cause scrollbars
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {showToast && (
        <SuccessToast
          message="Email Verified Successfully! Please log in."
          onClose={() => setShowToast(false)}
        />
      )}
      {/* mode="wait" ensures the old page fades out completely BEFORE the new one fades in */}
      <AnimatePresence mode="wait">
        {currentView === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full">
            <Login
              onNavigateToSignUp={() => navigate(routes.SIGNUP)}
              onNavigateToForgotPassword={() => navigate(routes.FORGOT_PASSWORD)}
            />
          </motion.div>
        )}
        
        {currentView === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full">
            <SignUp
              onNavigateToLogin={() => navigate(routes.SIGNIN)}
              redirectTo={routes.DASHBOARD}
            />
          </motion.div>
        )}

        {currentView === "forgotPassword" && (
          <motion.div
            key="forgotPassword"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full">
            <ForgotPassword
              onBackToLogin={() => navigate(routes.SIGNIN)}
              onNavigateToOtp={(email) => {
                setResetEmail(email);
                navigate(routes.OTP, { state: { email } });
              }}
            />
          </motion.div>
        )}

        {currentView === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full">
            <OtpVerification
              email={resetEmail}
              onBackToLogin={() => navigate(routes.SIGNIN)}
              onNavigateToChangePassword={(email, token) => {
                setResetEmail(email);
                setResetToken(token);
                navigate(routes.CHANGE_PASSWORD, { state: { email, token } });
              }}
            />
          </motion.div>
        )}

        {currentView === "changePassword" && (
          <motion.div
            key="changePassword"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full">
            <ChangePassword
              email={resetEmail}
              resetToken={resetToken}
              onBackToLogin={() => navigate(routes.SIGNIN)}
              redirectTo={routes.DASHBOARD}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default AuthPage;
