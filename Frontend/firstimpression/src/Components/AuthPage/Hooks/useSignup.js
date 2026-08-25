import { useState } from "react";
import { signUpApi } from "../services/authService";

/**
 * useSignUp
 * Encapsulates all state and business logic for the "Sign Up" flow:
 * - form field state (name, email, password, subscriptionPlan)
 * - password visibility toggle
 * - API call to register the user
 * - success / error / registered state
 */
const useSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subscriptionPlan: "",
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
    e.preventDefault();

    try {
      await signUpApi(formData);
      setShowToast(true);
      setIsRegistered(true);
    } catch (err) {
      const apiError = err.response?.data?.error;
      setErrorMsg(apiError || "Something went wrong!");
    }
  };

  return {
    // state
    showPassword,
    showToast,
    errorMsg,
    isRegistered,
    formData,
    // setters / handlers
    togglePasswordVisibility,
    closeToast,
    clearError,
    handleChange,
    handleSubmit,
  };
};

export default useSignUp;
