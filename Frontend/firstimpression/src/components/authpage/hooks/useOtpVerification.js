import { useState, useRef, useEffect } from "react";
import { verifyOtpApi } from "../services/authService";

/**
 * useOtpVerification
 * Encapsulates all state and business logic for the "Verify OTP" flow:
 * - 6-digit OTP input state and refs (focus management, backspace navigation)
 * - API call to verify the OTP
 * - success / error / loading state
 *
 * @param {Object} params
 * @param {string} params.email - email the OTP was sent to
 * @param {Function} params.onNavigateToChangePassword - callback invoked with (email, resetToken) after successful verification
 */
const useOtpVerification = ({ email, onNavigateToChangePassword }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const closeToast = () => setShowToast(false);
  const clearError = () => setError("");

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await verifyOtpApi(email, otpValue);

      setMsg(data.message || "OTP verified successfully!");
      setShowToast(true);
      setTimeout(() => {
        onNavigateToChangePassword(email, data.response.resetToken);
      }, 2000);
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || err.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // state
    otp,
    isLoading,
    error,
    showToast,
    msg,
    inputRefs,
    // handlers
    handleChange,
    handleKeyDown,
    handleVerifyOtp,
    closeToast,
    clearError,
  };
};

export default useOtpVerification;
