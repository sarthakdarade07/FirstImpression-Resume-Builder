import React from "react";
import { UserPlus, EyeOff, LogIn, ChevronDown, Eye } from "lucide-react";
import SuccessToast from "../notifications/SuccessToast";
import FailedToast from "../notifications/FailedToast";
import mainImage from "../../assets/promotional/loginpage.webp";
import icon_logo from "../../assets/promotional/Firstimpression_icon_logo.webp";
import { HashLink } from "react-router-hash-link";
import useSignUp from "./hooks/useSignup";
import { routes } from "../../routes/routes";


/**
 * SignUp
 * Pure UI component. All state and API logic lives in useSignUp.
 *
 * @param {Object} props
 * @param {Function} props.onNavigateToLogin - callback to navigate back to login (currently unused directly;
 *   the "Sign In" link uses HashLink routing, kept as a prop for parity with other auth screens)
 */
const SignUp = ({ onNavigateToLogin }) => {
  const {
    showPassword,
    showToast,
    errorMsg,
    isRegistered,
    formData,
    togglePasswordVisibility,
    closeToast,
    clearError,
    handleChange,
    handleSubmit,
  } = useSignUp();

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
          
          @keyframes heartbeat {
            0% { transform: scale(1); }
            14% { transform: scale(1.15); }
            28% { transform: scale(1); }
            42% { transform: scale(1.15); }
            70% { transform: scale(1); }
          }
          @keyframes ripple {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .animate-heartbeat {
            animation: heartbeat 1.5s infinite;
          }
          .animate-ripple {
            animation: ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          }
          .animate-ripple-delayed {
            animation: ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            animation-delay: 0.75s;
          }
        `}
      </style>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] flex flex-col-reverse md:flex-row rounded-[var(--auth-border-radius)] overflow-hidden shadow-2xl relative bg-white md:h-[90vh]">
        {/* Left Side (Dark Section) - Image below on mobile */}
        <div className="w-full md:w-1/2 bg-[#282321] min-h-[200px] md:min-h-0 hidden sm:flex flex-col relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={mainImage}
              alt="App Dashboard"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>

        {/* Right Side (White Section) - Form on top on mobile */}
        <div
          className="w-full md:w-1/2 bg-white p-[var(--auth-form-padding)] overflow-y-auto form-scroll"
          style={{ animation: "slideInRight 0.6s ease-out forwards" }}>
          <div className="flex flex-col min-h-full justify-between gap-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 md:mb-0">
              {/* Logo */}
              <div className="flex items-center cursor-pointer">
                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full border-[3px] sm:border-[3.5px] border-transparent shrink-0">
                  <img
                    src={icon_logo}
                    className="h-full w-full justify-center "
                  />
                </div>
                <span className="text-xl sm:text-[1.35rem] font-bold tracking-tight text-gray-900">
                  firstimpression
                </span>
              </div>

              {/* Back to Login Link */}
              <HashLink
                smooth
                to={routes.SIGNIN}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-[#FF5A00] font-medium transition-colors text-xs sm:text-sm">
                <LogIn size={18} strokeWidth={1.5} />
                Sign In
              </HashLink>
            </div>

            {/* Sign Up Form */}
            <div className="max-w-[420px] w-full mx-auto flex-grow flex flex-col justify-center py-8 md:py-0">
              {!isRegistered && (
                <h2 className="text-3xl sm:text-[2.75rem] font-medium text-gray-900 mb-8 sm:mb-10 tracking-tight text-center md:text-left">
                  Create Account
                </h2>
              )}

              {!isRegistered ? (
                <form
                  className="space-y-4 sm:space-y-5"
                  onSubmit={handleSubmit}>
                  {/* Name Input */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      required
                      minLength={2}
                      maxLength={15}
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      maxLength={20}
                      placeholder="Password (6-20 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors placeholder-gray-500 text-gray-900 text-sm sm:text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5A00] transition-colors">
                      {showPassword ? (
                        <Eye
                          size={20}
                          strokeWidth={1.5}
                          className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                        />
                      ) : (
                        <EyeOff
                          size={20}
                          strokeWidth={1.5}
                          className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                        />
                      )}
                    </button>
                  </div>

                  {/* Subscription Plan Dropdown */}
                  <div className="relative">
                    <select
                      name="subscriptionPlan"
                      defaultValue="Basic"
                      value={formData.subscriptionPlan}
                      onChange={handleChange}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition-colors text-gray-900 text-sm sm:text-[15px] appearance-none bg-white cursor-pointer">
                      <option value="Basic">Basic Plan</option>
                      <option value="Pro">Pro Plan</option>
                      <option value="Premium">Premium Plan</option>
                    </select>
                    {/* Custom chevron to replace the ugly default browser dropdown arrow */}
                    <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown
                        size={20}
                        strokeWidth={1.5}
                        className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                      />
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-[#FF4E00] to-[#E92B65] hover:opacity-90 text-white font-medium text-sm sm:text-[15px] py-4 sm:py-[18px] px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-[1px]">
                    <UserPlus size={18} strokeWidth={2} />
                    Create Account
                  </button>
                </form>
              ) : (
                <div className="w-full mx-auto flex-grow flex flex-col items-center justify-center space-y-8 animate-[slideInRight_0.6s_ease-out]">
                  <div className="relative w-32 h-32 flex items-center justify-center mt-8">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ripple"></div>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ripple-delayed"></div>
                    <div className="relative bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg animate-heartbeat z-10">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                      Check your inbox
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      Please verify your email which has been sent to
                      <br />
                      <span className="font-medium text-gray-900">
                        {formData.email}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Only render if successMsg */}

              {showToast && (
                <SuccessToast
                  message="Verification email sent!"
                  onClose={closeToast}
                />
              )}

              {/*  if errorMsg */}
              {errorMsg && (
                <FailedToast message={errorMsg} onClose={clearError} />
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center text-[10px] sm:text-[11px] text-gray-400 font-medium gap-4 md:gap-0 mt-8 md:mt-0">
              <p>© 2005-2025 firstimpression Inc.</p>
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="#"
                  className="hover:text-gray-500 transition-colors cursor-pointer">
                  Terms of Service
                </a>
                <button className="flex items-center gap-1 hover:text-gray-500 transition-colors cursor-pointer">
                  English <ChevronDown size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
