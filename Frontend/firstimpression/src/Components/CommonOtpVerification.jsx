import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import mainImage from "../assets/promotional/loginpage.webp";
import icon_logo from "../assets/promotional/Firstimpression_icon_logo.webp";
import SuccessToast from "./notifications/SuccessToast";
import FailedToast from "./notifications/FailedToast";

/**
 * CommonOtpVerification
 * Reusable OTP verification component for both Registration Email Verification and Forgot Password flows.
 *
 * @param {Object} props
 * @param {string} props.email - Email address to verify
 * @param {string} [props.title="Verify OTP"] - Title for the screen
 * @param {string} [props.subtitle] - Custom description text
 * @param {string} [props.submitButtonText="Verify OTP"] - Text for submit button
 * @param {string} [props.backText="Back to Login"] - Text for back button
 * @param {Function} props.onBack - Navigation callback to go back
 * @param {Function} props.onVerify - Async callback (otpString) => Promise<void>
 * @param {Function} [props.onResend] - Async callback () => Promise<void>
 * @param {number} [props.timerDuration=60] - Timer in seconds before resend is allowed (default 60s / 1 min)
 */
const CommonOtpVerification = ({
  email,
  title = "Verify OTP",
  subtitle,
  submitButtonText = "Verify OTP",
  backText = "Back to Login",
  timerDuration = 60,
  onBack,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(timerDuration);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleChange = (element, index) => {
    const val = element.value;
    if (val && !/^\d+$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Focus next input
    if (val !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArr = pasteData.split("");
      setOtp(pasteArr);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (onVerify) {
        await onVerify(otpValue);
      }
    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired OTP";
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending || !onResend) return;

    setIsResending(true);
    setError("");
    try {
      await onResend();
      setToastMsg("Verification OTP resent to your email!");
      setShowToast(true);
      setResendTimer(timerDuration);
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to resend OTP";
      setError(apiError);
    } finally {
      setIsResending(false);
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
                onClick={onBack}>
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

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-theme-red font-medium transition-colors text-xs sm:text-sm">
                  <ArrowLeft size={18} strokeWidth={1.5} />
                  {backText}
                </button>
              )}
            </div>

            {/* OTP Form */}
            <div className="max-w-[420px] w-full mx-auto flex-grow flex flex-col justify-center py-8 md:py-0">
              <h2 className="text-3xl sm:text-[2.75rem] font-medium text-gray-900 mb-4 tracking-tight text-center md:text-left leading-tight">
                {title}
              </h2>
              <p className="text-gray-500 mb-8 sm:mb-10 text-center md:text-left">
                {subtitle ? (
                  subtitle
                ) : (
                  <>
                    We have sent a 6-digit OTP to your email: <br />{" "}
                    <span className="font-semibold text-gray-800">{email}</span>
                  </>
                )}
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div
                  className="flex justify-center gap-2 sm:gap-3"
                  onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red transition-colors"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-6 bg-gradient-to-r from-theme-red-start to-theme-red-end hover:opacity-90 text-white font-medium text-sm sm:text-[15px] py-4 sm:py-[18px] px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-[1px] ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}>
                  <CheckCircle2 size={18} strokeWidth={2} />
                  {isLoading ? "Verifying..." : submitButtonText}
                </button>

                {onResend && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive code?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-gray-400 font-medium">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isResending}
                        onClick={handleResendOtp}
                        className="text-theme-red-hover hover:underline font-medium inline-flex items-center gap-1">
                        {isResending && (
                          <RefreshCw size={14} className="animate-spin" />
                        )}
                        {isResending ? "Resending..." : "Resend OTP"}
                      </button>
                    )}
                  </p>
                )}

                {showToast && (
                  <SuccessToast
                    message={toastMsg}
                    onClose={() => setShowToast(false)}
                  />
                )}

                {error && (
                  <FailedToast message={error} onClose={() => setError("")} />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonOtpVerification;
