import { useState } from "react";
import { changePasswordApi } from "../services/authService";

/**
 * useChangePassword
 * Encapsulates all state and business logic for the "Change Password" flow:
 * - form field state (password, confirm password, visibility toggles)
 * - validation
 * - API call to reset the password
 * - success / error / loading state
 *
 * @param {Object} params
 * @param {string} params.resetToken - token used to authorize the password reset
 * @param {Function} params.onBackToLogin - callback invoked after a successful reset
 */
const useChangePassword = ({ resetToken, onBackToLogin }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  const closeToast = () => setShowToast(false);
  const clearError = () => setError("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await changePasswordApi(resetToken, newPassword);
      setMsg(data.message || "Password changed successfully!");
      setShowToast(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // state
    newPassword,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    showToast,
    msg,
    // setters / handlers
    setNewPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    closeToast,
    clearError,
    handleChangePassword,
  };
};

export default useChangePassword;
