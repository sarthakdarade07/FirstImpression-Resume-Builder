import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi, resetPasswordApi } from "../services/authService";
import { setCredentials } from "../../../redux/slices/authslice";
import { routes } from "../../../routes/routes";

/**
 * useForgotPassword
 * Encapsulates state and logic for direct OTP Forgot Password flow:
 * - Step 1: Email -> triggers non-blocking OTP send and transitions immediately to Step 2
 * - Step 2: 6-digit OTP + New Password + Confirm Password with 60s (1 min) Resend timer
 * - Resets password directly via resetPasswordApi(email, otp, newPassword)
 * - Logs user in automatically and redirects to dashboard (or custom route)
 */
const useForgotPassword = ({
  onBackToLogin,
  onSuccess,
  redirectTo = routes.DASHBOARD,
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  const closeToast = () => setShowToast(false);
  const clearError = () => setError("");

  // Countdown timer for Resend OTP (1 min / 60s)
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Step 1: Send OTP non-blockingly and transition immediately to Step 2
  const handleGetOtp = (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setMsg("Sending OTP to your email...");
    setShowToast(true);
    setResendTimer(60);
    setStep(2);

    // Fire API call non-blockingly
    forgotPasswordApi(email).catch((err) => {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not send OTP email. Please check your email address.";
      setError(apiError);
    });
  };

  // Resend OTP handler (available after 60s timer expires)
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError("");
    try {
      setMsg("Fresh OTP sent to your email!");
      setShowToast(true);
      setResendTimer(60);
      setOtp(new Array(6).fill(""));
      await forgotPasswordApi(email);
    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to resend OTP.";
      setError(apiError);
    } finally {
      setIsResending(false);
    }
  };

  // Step 2: Reset password using email + OTP + newPassword
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await resetPasswordApi(email, otpValue, newPassword);
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
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "An error occurred while resetting password.";
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(new Array(6).fill(""));
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return {
    // state
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
    // setters / handlers
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
  };
};

export default useForgotPassword;
