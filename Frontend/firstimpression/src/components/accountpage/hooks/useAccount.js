import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../redux/slices/authslice';
import api from '../../../apis/axios';
import { verifyEmailOtpApi } from '../../authpage/services/authService';


/**
 * useAccount
 * Custom hook encapsulating all state and business logic for AccountPage:
 * - Profile image upload & removal
 * - Password reset flow (request OTP, verify OTP, update password)
 * - Toast notifications & loading states
 */
const useAccount = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const API_BASE_URL =
    import.meta.env?.VITE_BACKEND_BASE_URL ||
    process.env?.REACT_APP_BACKEND_BASE_URL;

  const [activeTab, setActiveTab] = useState('general');
  const [timer,setTimer] = useState(60);
  // Multi-step reset state: 1 = Request OTP, 2 = Verify OTP, 3 = New Password
  const [step, setStep] = useState(1);

  // Form values
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  const [isResending,setIsResending] = useState(false);

  const inputRefs = useRef([]);

  const toggleShowNew = () => setShowNew((prev) => !prev);
  const toggleShowConfirm = () => setShowConfirm((prev) => !prev);
  const closeToast = () => setShowToast(false);

  // Helper for split name
  const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';
  const lastName =
    user?.name && user.name.split(' ').length > 1
      ? user.name.split(' ').slice(1).join(' ')
      : '';


   //for otp resend
   
     useEffect(() => {
       let interval = null;
       if (step==2 && timer > 0) {
         interval = setInterval(() => { 
           setTimer((prev) => prev - 1);
         }, 1000);
       }
       return () => clearInterval(interval);
     }, [step,timer]);
 
      const handleResendOtp = async (e) => {
        if (e) e.preventDefault();
        if (timer > 0) return;        
        try {
          setIsResending(true);
          const response = await api.post("/api/auth/forgot-password", {
            email: user?.email,
          });
          setIsSuccess(true);
          setMsg(
            response.data?.message || "OTP resent to your registered email!",
          );
          setShowToast(true);
          setIsResending(false);
          setTimeout(() => setShowToast(false), 3000);
          // Reset input boxes and restart timer
          setOtp(new Array(6).fill(""));
          setTimer(60);
        } catch (err) {
          setIsSuccess(false);
          setIsResending(false);
          setMsg(
            err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Failed to resend OTP",
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } finally {
          setIsLoading(false);
        }
      };

  // 1. Profile Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setIsSuccess(false);
      setMsg('File size exceeds 10MB limit.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/upload-image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload profile image');
      }

      dispatch(setUser({ ...user, profileImageUrl: data.image_url }));

      setIsSuccess(true);
      setMsg('Profile photo updated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setIsSuccess(false);
      setMsg(err.message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  // 2. Remove Profile Image
  const handleRemoveImage = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/remove-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove profile image');
      }

      dispatch(setUser({ ...user, profileImageUrl: null }));

      setIsSuccess(true);
      setMsg('Profile photo removed successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setIsSuccess(false);
      setMsg(err.message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Step 1: Request OTP
  const handleRequestReset = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
      setIsSuccess(true);
      setMsg('OTP sent to your email!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setStep(2);
    } catch (err) {
      setIsSuccess(false);
      setMsg(err.message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };


  // 4. Step 2: Validate OTP and advance to Step 3
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setIsSuccess(false);
      setMsg("Please enter the complete 6-digit OTP.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setStep(3);
  };

  // 5. Step 3: Change Password
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (newPassword !== confirmPassword) {
      setIsSuccess(false);
      setMsg('New passwords do not match.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    if (newPassword.length < 6) {
      setIsSuccess(false);
      setMsg('Password must be at least 6 characters long.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setIsSuccess(false);
      setMsg("Please enter the 6-digit OTP.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/reset-password', {
        email: user?.email,
        otp: otpValue,
        newPassword,
      });

      setIsSuccess(true);
      setMsg(response.data?.message || 'Password successfully updated!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Reset password flow state
      setStep(1);
      setOtp(new Array(6).fill(''));
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setIsSuccess(false);
      setMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to reset password'
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 2) {
        handleVerifyOtp(e);
      }
    }
  };

  return {
    // State
    user,
    firstName,
    lastName,
    activeTab,
    setActiveTab,
    step,
    setStep,
    otp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    isLoading,
    showToast,
    isSuccess,
    msg,
    inputRefs,
    timer,
    isResending,

    // Handlers
    toggleShowNew,
    toggleShowConfirm,

    closeToast,
    handleImageUpload,
    handleRemoveImage,
    handleResendOtp,
    handleRequestReset,
    handleVerifyOtp,
    handleChangePassword,
    handleOtpChange,
    handleOtpKeyDown,
  };
};

export default useAccount;
