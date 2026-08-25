import React from "react";
import CommonOtpVerification from "../CommonOtpVerification";
import { verifyOtpApi, forgotPasswordApi } from "./services/authService";

/**
 * OtpVerification (Forgot Password Flow)
 * Uses CommonOtpVerification under the hood.
 *
 * @param {Object} props
 * @param {string} props.email - email the OTP was sent to
 * @param {Function} props.onBackToLogin - callback to navigate back to login
 * @param {Function} props.onNavigateToChangePassword - callback to navigate to Change Password screen (email, resetToken)
 */
const OtpVerification = ({
  email,
  onBackToLogin,
  onNavigateToChangePassword,
}) => {
  const handleVerify = async (otpValue) => {
    const data = await verifyOtpApi(email, otpValue);
    if (onNavigateToChangePassword && data?.response?.resetToken) {
      setTimeout(() => {
        onNavigateToChangePassword(email, data.response.resetToken);
      }, 1000);
    }
  };

  const handleResend = async () => {
    await forgotPasswordApi(email);
  };

  return (
    <CommonOtpVerification
      email={email}
      title="Verify OTP"
      subtitle={
        <>
          We have sent a 6-digit OTP to your email: <br />{" "}
          <span className="font-semibold text-gray-800">{email}</span>
        </>
      }
      submitButtonText="Verify OTP"
      backText="Back to Login"
      onBack={onBackToLogin}
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
};

export default OtpVerification;
