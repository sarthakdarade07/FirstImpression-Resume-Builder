import React, { useRef, useEffect } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import mainImage from "../../assets/promotional/loginpage.webp";
import icon_logo from "../../assets/promotional/Firstimpression_icon_logo.webp";
import SuccessToast from "../notifications/SuccessToast";
import FailedToast from "../notifications/FailedToast";
import useForgotPassword from "./hooks/useForgotPassword";
import { routes } from "../../routes/routes";

/**
 * ForgotPassword
 * Comprehensive UI component supporting:
 * - Step 1: Request OTP for email (non-blocking immediate transition)
 * - Step 2: Enter 6-digit OTP + New Password + Confirm Password with 60s (1 min) Resend timer
 *
 * @param {Object} props
 * @param {Function} props.onBackToLogin - callback to navigate back to login
 * @param {Function} [props.onSuccess] - callback invoked after a successful reset
 * @param {string} [props.redirectTo=routes.DASHBOARD] - destination route upon reset
 */
const ForgotPassword = ({
  onBackToLogin,
  onSuccess,
  redirectTo = routes.DASHBOARD,
}) => {
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    resendTimer,
    isLoading,
    isResending,
    error,
    showToast,
    msg,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    closeToast,
    clearError,
    handleGetOtp,
    handleResendOtp,
    handleResetPassword,
    handleBackToStep1,
  } = useForgotPassword({ onBackToLogin, onSuccess, redirectTo });

  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split("");
      setOtp(pasteArray);
      inputRefs.current[5]?.focus();
    }
  };

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
                onClick={step === 2 ? handleBackToStep1 : onBackToLogin}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-theme-red font-medium transition-colors text-xs sm:text-sm">
                <ArrowLeft size={18} strokeWidth={1.5} />
                {step === 2 ? "Change Email" : "Back to Login"}
              </button>
            </div>

            {/* Form Body */}
            <div className="max-w-[420px] w-full mx-auto flex-grow flex flex-col justify-center py-8 md:py-0">
              {step === 1 ? (
                /* Step 1: Email Input */
                <>
                  <h2 className="text-3xl sm:text-[2.75rem] font-medium text-gray-900 mb-4 tracking-tight text-center md:text-left leading-tight">
                    Forgot Password
                  </h2>
                  <p className="text-gray-500 mb-8 sm:mb-10 text-center md:text-left">
                    Enter your email address and we'll send you a 6-digit OTP to
                    reset your password.
                  </p>

                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={handleGetOtp}>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-theme-red-start to-theme-red-end hover:opacity-90 text-white font-medium text-sm sm:text-[15px] py-4 sm:py-[18px] px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-[1px]">
                      <Mail size={18} strokeWidth={2} />
                      Get OTP
                    </button>
                  </form>
                </>
              ) : (
                /* Step 2: OTP + New Password Form */
                <>
                  <h2 className="text-3xl sm:text-[2.75rem] font-medium text-gray-900 mb-2 tracking-tight text-center md:text-left leading-tight">
                    Reset Password
                  </h2>
                  <p className="text-gray-500 mb-6 text-center md:text-left text-sm">
                    Enter the 6-digit OTP sent to{" "}
                    <span className="font-semibold text-gray-800">{email}</span>{" "}
                    and your new password.
                  </p>

                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={handleResetPassword}>
                    {/* 6-digit OTP Inputs */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        6-Digit OTP Code
                      </label>
                      <div
                        className="flex justify-between gap-2 sm:gap-3"
                        onPaste={handleOtpPaste}>
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e.target, index)}
                            className="w-11 h-12 sm:w-13 sm:h-14 text-center text-xl font-bold rounded-xl border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-2 focus:ring-theme-red/20 transition-all bg-gray-50 text-gray-900"
                          />
                        ))}
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password (min 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                        required
                        minLength={6}
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

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                        required
                        minLength={6}
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

                    {/* Resend OTP Section with 1-Minute Timer */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-1">
                      <span>Didn't receive the code?</span>
                      {resendTimer > 0 ? (
                        <span className="font-semibold text-theme-red">
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="font-semibold text-theme-red hover:underline flex items-center gap-1">
                          {isResending && (
                            <RefreshCw size={12} className="animate-spin" />
                          )}
                          Resend OTP
                        </button>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full mt-4 sm:mt-6 bg-gradient-to-r from-theme-red-start to-theme-red-end hover:opacity-90 text-white font-medium text-sm sm:text-[15px] py-4 sm:py-[18px] px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-[1px] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                      {isLoading ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Lock size={18} strokeWidth={2} />
                      )}
                      {isLoading ? "Saving..." : "Reset Password"}
                    </button>
                  </form>
                </>
              )}

              {showToast && <SuccessToast message={msg} onClose={closeToast} />}
              {error && <FailedToast message={error} onClose={clearError} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
