import api from "../../../api/axios";

/**
 * User Login API
 */
export const loginUserApi = async (email, password) => {
  const response = await api.post("/api/auth/login", {
    email: email,
    password: password,
  });

  const data = response.data;
  if (data?.response?.jwtToken) {
    localStorage.setItem("jwtToken", data.response.jwtToken);
  }
  return data;
};

/**
 * User Sign Up / Register API
 */
export const signUpApi = async (formData) => {
  const response = await api.post("/api/auth/register", formData);
  return response.data;
};

/**
 * Forgot Password (Request OTP) API
 */
export const forgotPasswordApi = async (email) => {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
};

/**
 * Verify OTP API
 */
export const verifyOtpApi = async (email, otp) => {
  const response = await api.post("/api/auth/verify-otp", { email, otp });
  return response.data;
};

/**
 * Reset / Change Password API
 */
export const resetPasswordApi = async (resetToken, newPassword) => {
  const response = await api.post("/api/auth/reset-password", {
    resetToken,
    newPassword,
  });
  return response.data;
};

export const changePasswordApi = resetPasswordApi;



