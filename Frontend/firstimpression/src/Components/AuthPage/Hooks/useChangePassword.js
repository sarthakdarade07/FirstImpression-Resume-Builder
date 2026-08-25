import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../services/authService";
import { setCredentials } from "../../../redux/slices/authslice";
import { routes } from "../../../routes/routes";

/**
 * useChangePassword
 * Encapsulates all state and business logic for the "Change Password" flow:
 * - form field state (password, confirm password, visibility toggles)
 * - validation
 * - API call to reset the password
 * - logs user in and redirects to configurable destination (default: /dashboard)
 * - success / error / loading state
 *
 * @param {Object} params
 * @param {string} params.resetToken - token used to authorize the password reset
 * @param {Function} [params.onBackToLogin] - callback to navigate back to login
 * @param {Function} [params.onSuccess] - optional callback invoked after a successful reset
 * @param {string} [params.redirectTo=routes.DASHBOARD] - path to redirect to upon password reset
 */
const useChangePassword = ({
  resetToken,
  onBackToLogin,
  onSuccess,
  redirectTo = routes.DASHBOARD,
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      if (data?.response) {
        const user = {
          id: data.response.id,
          name: data.response.name,
          email: data.response.email,
          subscriptionPlan: data.response.subscriptionPlan,
          profileImageUrl: data.response.profileImageUrl,
        };
        dispatch(setCredentials({ token: data.response.jwtToken, user }));
      }
      setMsg(data.message || "Password changed successfully! Redirecting...");
      setShowToast(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data);
        } else if (redirectTo) {
          navigate(redirectTo);
        } else if (onBackToLogin) {
          onBackToLogin();
        }
      }, 1200);
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
