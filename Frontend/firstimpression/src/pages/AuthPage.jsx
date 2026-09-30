import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../components/authpage/Login";
import SignUp from "../components/authpage/SignUp";
import ForgotPassword from "../components/authpage/ForgotPassword";
import OtpVerification from "../components/authpage/OtpVerification";
import ChangePassword from "../components/authpage/ChangePassword";
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

  // State to pass between steps (or read from location.state)
  const [resetEmail, setResetEmail] = useState(location.state?.email || "");
  const [resetOtp, setResetOtp] = useState(location.state?.otp || "");

  useEffect(() => {
    if (location.state?.email) {
      setResetEmail(location.state.email);
    }
    if (location.state?.otp) {
      setResetOtp(location.state.otp);
    }
  }, [location.state]);

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
              redirectTo={routes.DASHBOARD}
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
              email={location.state?.email || resetEmail}
              mode={location.state?.mode || "verify-email"}
              onBack={() => navigate(routes.SIGNIN)}
              onSuccess={(data) => {
                if (location.state?.mode === "forgot-password" || data?.otp) {
                  const targetEmail = data?.email || location.state?.email || resetEmail;
                  const targetOtp = data?.otp || "";
                  setResetEmail(targetEmail);
                  setResetOtp(targetOtp);
                  navigate(routes.CHANGE_PASSWORD, {
                    state: { email: targetEmail, otp: targetOtp },
                  });
                } else {
                  navigate(routes.SIGNIN + "?verified=true");
                }
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
              email={location.state?.email || resetEmail}
              otp={location.state?.otp || resetOtp}
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
