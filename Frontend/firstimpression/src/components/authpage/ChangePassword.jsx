import React from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import mainImage from "../../assets/promotional/loginpage.webp";
import icon_logo from "../../assets/promotional/Firstimpression_icon_logo.webp";
import SuccessToast from "../notifications/SuccessToast";
import FailedToast from "../notifications/FailedToast";
import useChangePassword from "./hooks/useChangePassword";

import { routes } from "../../routes/routes";

/**
 * ChangePassword
 * Pure UI component. All state and API logic lives in useChangePassword.
 *
 * @param {Object} props
 * @param {string} props.email - email associated with the reset request (display only)
 * @param {string} props.resetToken - token used to authorize the password reset
 * @param {Function} [props.onBackToLogin] - callback to navigate back to login
 * @param {Function} [props.onSuccess] - callback invoked after a successful reset
 * @param {string} [props.redirectTo=routes.DASHBOARD] - path to redirect to upon password reset
 */
const ChangePassword = ({
  email,
  resetToken,
  onBackToLogin,
  onSuccess,
  redirectTo = routes.DASHBOARD,
}) => {
  const {
    newPassword,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    showToast,
    msg,
    setNewPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    closeToast,
    clearError,
    handleChangePassword,
  } = useChangePassword({ resetToken, onBackToLogin, onSuccess, redirectTo });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-[var(--auth-bg-padding)] font-sans">
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .form-scroll::-webkit-scrollbar { width: 6px; }
          .form-scroll::-webkit-scrollbar-track { background: transparent; }
          .form-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        `}
      </style>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] flex flex-col-reverse md:flex-row rounded-[var(--auth-border-radius)] overflow-hidden shadow-2xl relative bg-white md:h-[90vh]">
        {/* Left Side (Dark Section) */}
        <div className="w-full md:w-1/2 bg-[#282321] min-h-[200px] md:min-h-0 hidden sm:flex flex-col relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={mainImage}
              alt="App Dashboard"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>

        {/* Right Side (White Section) */}
        <div
          className="w-full md:w-1/2 bg-white p-[var(--auth-form-padding)] overflow-y-auto form-scroll"
          style={{ animation: "slideInRight 0.6s ease-out forwards" }}>
          <div className="flex flex-col min-h-full justify-between gap-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 md:mb-0">
              <div
                className="flex items-center cursor-pointer"
                onClick={onBackToLogin}>
                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full border-[3px] sm:border-[3.5px] border-transparent shrink-0">
                  <img
                    src={icon_logo}
                    alt="Logo"
                    className="h-full w-full justify-center"
                  />
                </div>
                <span className="text-xl sm:text-[1.35rem] font-bold tracking-tight text-gray-900 ml-2">
                  firstimpression
                </span>
              </div>

              <button
                onClick={onBackToLogin}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-theme-red font-medium transition-colors text-xs sm:text-sm">
                <ArrowLeft size={18} strokeWidth={1.5} />
                Back to Login
              </button>
            </div>

            {/* Change Password Form */}
            <div className="max-w-[420px] w-full mx-auto flex-grow flex flex-col justify-center py-8 md:py-0">
              <h2 className="text-3xl sm:text-[2.75rem] font-medium text-gray-900 mb-4 tracking-tight text-center md:text-left leading-tight">
                Reset Password
              </h2>
              <p className="text-gray-500 mb-8 sm:mb-10 text-center md:text-left">
                Enter a new password for{" "}
                <span className="font-semibold text-gray-800">{email}</span>.
              </p>

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleChangePassword}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors">
                    {showPassword ? (
                      <Eye size={20} strokeWidth={1.5} />
                    ) : (
                      <EyeOff size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors">
                    {showConfirmPassword ? (
                      <Eye size={20} strokeWidth={1.5} />
                    ) : (
                      <EyeOff size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-4 sm:mt-6 bg-gradient-to-r from-theme-red-start to-theme-red-end hover:opacity-90 text-white font-medium text-sm sm:text-[15px] py-4 sm:py-[18px] px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-[1px] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                  <Lock size={18} strokeWidth={2} />
                  {isLoading ? "Saving..." : "Change Password"}
                </button>

                {showToast && (
                  <SuccessToast message={msg} onClose={closeToast} />
                )}

                {error && <FailedToast message={error} onClose={clearError} />}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
