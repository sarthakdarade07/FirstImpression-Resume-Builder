import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../../../redux/thunks/auththunk";
import { routes } from "../../../routes/routes";
import { resendVerificationApi } from "../services/authService";

const useLogin = ({ onNavigateToForgotPassword }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmailChange = (e) => {
    setEmailOrUsername(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleTogglePassword = () => {
    setShowPassword((previous) => !previous);
  };

  const handleForgotPassword = () => {
    onNavigateToForgotPassword();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        loginUser({
          email: emailOrUsername,
          password,
        }),
      ).unwrap();
        
      const redirectUrl = searchParams.get("redirect");
      const destination = redirectUrl
        ? decodeURIComponent(redirectUrl)
        : routes.DASHBOARD;

      setMsg("Login successful!");
      setShowToast(true);
      navigate(destination, { replace: true });

    } catch (errorMessage) {
      const errorStr =
        typeof errorMessage === "string" ? errorMessage.toLowerCase() : "";
 
      if (
        errorStr.includes("verify your email") ||
        errorStr.includes("verify email")
      ) {
        // 1. Automatically trigger the OTP email
        try {
          await resendVerificationApi(emailOrUsername);
        } catch (err) {
          console.warn("Could not auto-send verification OTP:", err);
        }
        // 2. Redirect to OTP verification page
        navigate(routes.OTP, {
          state: {
            email: emailOrUsername,
            mode: "verify-email",
          },
        });
        return;
      }
      setError(errorMessage || "Invalid credentials");
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleCloseSuccess = () => {
    setShowToast(false);
  };

  return {
    // Values
    emailOrUsername,
    password,

    showPassword,
    isLoading,

    error,

    showToast,
    msg,

    // Handlers
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleForgotPassword,
    handleLogin,

    handleCloseError,
    handleCloseSuccess,
  };
};

export default useLogin;
