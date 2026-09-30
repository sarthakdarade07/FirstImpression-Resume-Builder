import React from "react";
import CommonOtpVerification from "../CommonOtpVerification";

/**
 * OtpVerification
 * Generic OTP verification component wrapping CommonOtpVerification.
 * Supports:
 * - mode="verify-email" (registration / unverified login activation)
 * - mode="forgot-password" (password reset flow)
 */
const OtpVerification = (props) => {
  return <CommonOtpVerification {...props} />;
};

export default OtpVerification;
