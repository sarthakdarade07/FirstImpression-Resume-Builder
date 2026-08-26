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
 * Reset / Change Password API (Direct Email + OTP + New Password)
 */
export const resetPasswordApi = async (email, otp, newPassword) => {
  const response = await api.post("/api/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  const data = response.data;
  if (data?.response?.jwtToken) {
    localStorage.setItem("jwtToken", data.response.jwtToken);
  }
  if (data?.response) {
    const user = {
      id: data.response.id,
      name: data.response.name,
      email: data.response.email,
      subscriptionPlan: data.response.subscriptionPlan,
      profileImageUrl: data.response.profileImageUrl,
    };
    localStorage.setItem("user", JSON.stringify(user));
  }
  return data;
};

/**
 * Verify Email OTP API (New Account Registration)
 */
export const verifyEmailOtpApi = async (email, otp) => {
  const response = await api.post("/api/auth/verify-email", { email, otp });
  const data = response.data;
  if (data?.response?.jwtToken) {
    localStorage.setItem("jwtToken", data.response.jwtToken);
  }
  if (data?.response) {
    const user = {
      id: data.response.id,
      name: data.response.name,
      email: data.response.email,
      subscriptionPlan: data.response.subscriptionPlan,
      profileImageUrl: data.response.profileImageUrl,
    };
    localStorage.setItem("user", JSON.stringify(user));
  }
  return data;
};

/**
 * Resend Email Verification OTP API
 */
export const resendVerificationApi = async (email) => {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
};

export const changePasswordApi = resetPasswordApi;



