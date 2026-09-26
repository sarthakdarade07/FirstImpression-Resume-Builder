import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';

const ProfileBasicInfo = ({ data, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    location: '',
    email: '',
    phoneNo: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    photoUrl: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      const parts = (data.name || '').trim().split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      setFormData({
        firstName: fName,
        lastName: lName,
        role: data.role || '',
        location: data.location || '',
        email: data.email || '',
        phoneNo: data.phoneNo || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        photoUrl: data.photoUrl || '',
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName;
    
    await onSave({
      name: fullName,
      role: formData.role,
      location: formData.location,
      email: formData.email,
      phoneNo: formData.phoneNo,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      portfolioUrl: formData.portfolioUrl,
      photoUrl: formData.photoUrl,
    });
    setIsSaving(false);
  };

  return (
    <div>
      <h2 className="text-[1.7rem] font-bold text-gray-900 mb-8 tracking-tight">Basic Info</h2>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-[32px] bg-[#222] flex items-center justify-center text-white text-2xl font-medium shadow-md overflow-hidden flex-shrink-0">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              formData.firstName ? `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase() : 'SE'
            )}
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-1">Profile Photo URL</h4>
            <p className="text-sm text-gray-500 mb-3">Direct link or image URL for your avatar</p>
            <input
              type="url"
              value={formData.photoUrl}
              onChange={(e) => handleChange('photoUrl', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full sm:w-80 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all text-sm font-medium placeholder-gray-400"
            />
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">First name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="First name"
              required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Last name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Last name"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
            />
          </div>
        </div>

        {/* Role & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Role / Headline</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. New York, NY"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
        </div>

        <hr className="border-gray-100 my-8" />

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNo}
              onChange={(e) => handleChange('phoneNo', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
        </div>

        <hr className="border-gray-100 my-8" />

        {/* Social Links */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Portfolio URL</label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => handleChange('portfolioUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium placeholder-gray-400"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileBasicInfo;
