import React from 'react';
import { Shield, Key, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight, Settings, Code, Lock, ArrowUpCircle, CreditCard, FileText } from 'lucide-react';
import SidebarPageLayout from '../components/dashboard/SidebarPageLayout';
import FailedToast from '../components/notifications/FailedToast';
import SuccessToast from '../components/notifications/SuccessToast';
import useAccount from '../components/accountPage/hooks/useAccount';

const AccountPage = () => {
  const {
    user,
    firstName,
    lastName,
    activeTab,
    setActiveTab,
    step,
    otp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNew,
    showConfirm,
    isLoading,
    showToast,
    isSuccess,
    msg,
    inputRefs,
    toggleShowNew,
    toggleShowConfirm,
    handleImageUpload,
    handleRemoveImage,
    handleRequestReset,
    handleVerifyOtp,
    handleChangePassword,
    handleOtpChange,
    handleOtpKeyDown,
  } = useAccount();

  const sections = [
    {
      title: 'General',
      items: [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'developers', label: 'Developers', icon: Code },
        { id: 'security', label: 'Security', icon: Lock },
      ],
    },
    {
      title: 'Billing & Plans',
      items: [
        { id: 'upgrade', label: 'Upgrade', icon: ArrowUpCircle },
        { id: 'plan', label: 'Your plan', icon: CreditCard },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'billing', label: 'Billing details', icon: CreditCard },
      ],
    },
  ];

  return (
    <>
      <SidebarPageLayout
        sections={sections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      >

        {/* Tab: General */}
        {activeTab === 'general' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">General</h2>
            
            <div className="space-y-8 max-w-3xl">
              
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-white text-2xl font-bold shadow-md overflow-hidden flex-shrink-0 border-2 border-white">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'SE'
                  )}
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold mb-1">Profile photo</h4>
                  <p className="text-sm text-gray-500 mb-4">We support PNG, JPEG, WEBP, and HEIC up to 10MB (automatically stored as WebP)</p>
                  <div className="flex flex-wrap gap-3">
                    <label className="cursor-pointer inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-500 shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*,.heic,.heif,image/heic,image/heif" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        disabled={isLoading}
                      />
                      {isLoading ? 'Uploading...' : 'Upload new picture'}
                    </label>
                    {user?.profileImageUrl && (
                      <button 
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-semibold disabled:opacity-70"
                      >
                        {isLoading ? 'Removing...' : 'Remove photo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">First name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    readOnly
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Last name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    readOnly
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-gray-500 text-[15px]">{user?.email || 'guest@example.com'}</span>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-[#FF7A59] text-white text-sm font-bold rounded-full hover:bg-[#ff6a45] transition-colors shadow-sm">
                      Verify
                    </button>
                    <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-gray-500 text-[15px]">No phone number</span>
                  <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                    Add phone number
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* Deactivate Account */}
              <div className="pb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">Deactivate account</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-gray-500 text-[15px]">This will remove you from all workspaces</span>
                  <button className="px-6 py-2.5 bg-[#FF4747] text-white text-sm font-bold rounded-full hover:bg-red-600 transition-colors shadow-sm shadow-red-200/50">
                    Deactivate account
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Security (Password Reset) */}
        {activeTab === 'security' && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-200">
                <Shield className="w-6 h-6 text-[var(--theme-red)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Security</h2>
            </div>
            
            <div className="max-w-xl">
              {step === 1 && (
                <div>
                  <p className="text-gray-500 font-medium mb-6">
                    To ensure security, we will send a 6-digit OTP to your registered email address before allowing you to reset your password.
                  </p>
                  <button 
                    onClick={handleRequestReset}
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(255,78,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    {isLoading ? 'Sending OTP...' : 'Reset Password'}
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-3">Enter 6-Digit OTP</label>
                    <div className="flex gap-2 sm:gap-3">
                      {otp.map((data, index) => (
                        <input
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-white border border-gray-300 rounded-xl focus:border-[var(--theme-red-start)] focus:ring-2 focus:ring-[var(--theme-red-start)] outline-none transition-all"
                          type="text"
                          name="otp"
                          maxLength="1"
                          key={index}
                          value={data}
                          onChange={(e) => handleOtpChange(e.target, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                        />
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(255,78,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">New Password</label>
                    <div className="relative flex items-center">
                      <Key className="w-5 h-5 text-gray-400 absolute left-4" />
                      <input 
                        type={showNew ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] focus:border-transparent transition-all font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={toggleShowNew}
                        className="absolute right-4 text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Confirm New Password</label>
                    <div className="relative flex items-center">
                      <Key className="w-5 h-5 text-gray-400 absolute left-4" />
                      <input 
                        type={showConfirm ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] focus:border-transparent transition-all font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={toggleShowConfirm}
                        className="absolute right-4 text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(255,78,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Fallback for other tabs */}
        {['preferences', 'developers', 'upgrade', 'plan', 'invoices', 'billing'].includes(activeTab) && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center mb-4 text-gray-400">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
            <p className="text-gray-500">This section is currently under construction.</p>
          </div>
        )}
      </SidebarPageLayout>

      {showToast && (
        <div className="fixed bottom-10 right-10 z-50">
          {isSuccess ? <SuccessToast message={msg} /> : <FailedToast message={msg} />}
        </div>
      )}
    </>
  );
};

export default AccountPage;
