import { useState } from "react";
import { forgotPasswordApi } from "../services/authService";

/**
 * useForgotPassword
 * Encapsulates all state and business logic for the "Forgot Password" flow:
 * - email field state
 * - API call to request an OTP
 * - success / error / loading state
 *
 * @param {Object} params
 * @param {Function} params.onNavigateToOtp - callback invoked with the email after a successful OTP request
 */
const useForgotPassword = ({ onNavigateToOtp }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");

  const closeToast = () => setShowToast(false);
  const clearError = () => setError("");

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await forgotPasswordApi(email);
      setMsg(data.message || "OTP sent successfully!");
      setShowToast(true);
      setTimeout(() => {
        onNavigateToOtp(email);
      }, 2000); // Navigate to OTP after 2 seconds
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // state
    email,
    isLoading,
    error,
    showToast,
    msg,
    // setters / handlers
    setEmail,
    closeToast,
    clearError,
    handleGetOtp,
  };
};

export default useForgotPassword;
