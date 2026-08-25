import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signUpApi,
  verifyEmailOtpApi,
  resendVerificationApi,
} from "../services/authService";
import { setCredentials } from "../../../redux/slices/authslice";
import { routes } from "../../../routes/routes";

/**
 * useSignUp
 * Encapsulates all state and business logic for the "Sign Up" flow:
 * - form field state (name, email, password, subscriptionPlan)
 * - password visibility toggle
 * - API call to register the user
 * - email verification OTP handling
 * - configurable redirect after verification (defaulting to /dashboard or custom callback)
 * - success / error / registered state
 */
const useSignUp = ({
  onNavigateToLogin,
  onVerificationSuccess,
  redirectTo = routes.DASHBOARD,
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subscriptionPlan: "Basic",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const closeToast = () => setShowToast(false);
  const clearError = () => setErrorMsg("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setErrorMsg("");
    setIsLoading(true);

    try {
      await signUpApi(formData);
      setToastMsg("Verification OTP sent to your email!");
      setShowToast(true);
      setIsRegistered(true);
    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong!";
      setErrorMsg(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (otp) => {
    const data = await verifyEmailOtpApi(formData.email, otp);
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
    setToastMsg(data.message || "Email verified successfully! Redirecting...");
    setShowToast(true);
    setTimeout(() => {
      if (onVerificationSuccess) {
        onVerificationSuccess(data);
      } else if (redirectTo) {
        navigate(redirectTo);
      } else if (onNavigateToLogin) {
        onNavigateToLogin();
      }
    }, 1200);
  };

  const handleResendEmailOtp = async () => {
    await resendVerificationApi(formData.email);
  };

  const handleBackFromOtp = () => {
    setIsRegistered(false);
  };

  return {
    // state
    showPassword,
    showToast,
    toastMsg,
    errorMsg,
    isLoading,
    isRegistered,
    formData,
    // setters / handlers
    togglePasswordVisibility,
    closeToast,
    clearError,
    handleChange,
    handleSubmit,
    handleVerifyEmailOtp,
    handleResendEmailOtp,
    handleBackFromOtp,
  };
};

export default useSignUp;
