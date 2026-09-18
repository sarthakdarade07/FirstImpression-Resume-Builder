import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  Plus,
  Trash2,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'languages', label: 'Languages', icon: Globe }
];

export default function ResumeEditorPanel({
  resumeData = {},
  onChange,
  resumeTitle = '',
  onTitleChange,
  onSave,
  isSaving = false,
  lastSaved = null,
  onClose,
  profileData: propProfileData = null
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileData, setProfileData] = useState(propProfileData);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (propProfileData) {
      setProfileData(propProfileData);
      return;
    }
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    setLoadingProfile(true);
    api.get('/api/profile/get-profile')
      .then((res) => {
        const data = res.data?.message || res.data;
        if (data) setProfileData(data);
      })
      .catch((err) => {
        console.warn('Failed to load profile for resume editor:', err?.message || err);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [propProfileData]);

  const profilePersonal = profileData?.personalInformation || {};
  const profileAuth = profileData?.authResponse || {};
  const profileExperiences = profileData?.workExperiences || [];
  const profileEducations = profileData?.educations || [];
  const profileSkills = profileData?.skills || [];
  const profileProjects = profileData?.projects || [];
  const profileCertifications = profileData?.certifications || [];
  const profileLanguages = profileData?.languages || [];

  const getYearOrDate = (val) => {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('-')) return val.split('-')[0];
    return String(val);
  };

  const parseTech = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((t) => t.trim()).filter(Boolean);
    return [];
  };

  const personal = resumeData?.personal || {};
  const summary = resumeData?.summary || '';
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const skills = resumeData?.skills || [];
  const projects = resumeData?.projects || [];
  const certifications = resumeData?.certifications || [];
  const languages = resumeData?.languages || [];

  // Personal Info handlers - atomic updates prevent stale closure overwrites
  const handlePersonalUpdate = (updates) => {
    onChange({
      ...resumeData,
      personal: {
        ...(resumeData?.personal || {}),
        ...updates
      }
    });
  };

  const handlePersonalChange = (field, value) => {
    handlePersonalUpdate({ [field]: value });
  };

  // Summary handler
  const handleSummaryChange = (value) => {
    onChange({
      ...resumeData,
      summary: value
    });
  };

  // Experience handlers
  const handleExperienceChange = (idx, field, value) => {
    const updated = [...experience];
    const item = { ...updated[idx], [field]: value };
    if (field === 'endDate') {
      item.current = Boolean(value && value.trim().toLowerCase() === 'present');
    }
    updated[idx] = item;
    onChange({ ...resumeData, experience: updated });
  };

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Job Title',
      company: 'Company Name',
      location: 'City, Country',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: '',
      highlights: ['Key accomplishment or impact metric.']
    };
    onChange({ ...resumeData, experience: [newExp, ...experience] });
  };

  const handleRemoveExperience = (idx) => {
    const updated = experience.filter((_, i) => i !== idx);
    onChange({ ...resumeData, experience: updated });
  };

  const handleAddExpHighlight = (expIdx) => {
    const updated = [...experience];
    const item = { ...updated[expIdx] };
    const h = Array.isArray(item.highlights) ? [...item.highlights] : [];
    h.push('');
    item.highlights = h;
    updated[expIdx] = item;
    onChange({ ...resumeData, experience: updated });
  };

  const handleUpdateExpHighlight = (expIdx, hIdx, value) => {
    const updated = [...experience];
    const item = { ...updated[expIdx] };
    const h = [...item.highlights];
    h[hIdx] = value;
    item.highlights = h;
    updated[expIdx] = item;
    onChange({ ...resumeData, experience: updated });
  };

  const handleRemoveExpHighlight = (expIdx, hIdx) => {
    const updated = [...experience];
    const item = { ...updated[expIdx] };
    const h = item.highlights.filter((_, i) => i !== hIdx);
    item.highlights = h;
    updated[expIdx] = item;
    onChange({ ...resumeData, experience: updated });
  };

  // Education handlers
  const handleEducationChange = (idx, field, value) => {
    const updated = [...education];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...resumeData, education: updated });
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'University Name',
      location: 'City, Country',
      startDate: '2020',
      endDate: '2024',
      gpa: '',
      highlights: []
    };
    onChange({ ...resumeData, education: [newEdu, ...education] });
  };

  const handleRemoveEducation = (idx) => {
    const updated = education.filter((_, i) => i !== idx);
    onChange({ ...resumeData, education: updated });
  };

  // Skills handlers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    // Check if skills is grouped array or flat array
    if (skills.length > 0 && skills[0].items) {
      // Grouped format
      const updated = [...skills];
      updated[0] = {
        ...updated[0],
        items: [...updated[0].items, trimmed]
      };
      onChange({ ...resumeData, skills: updated });
    } else {
      // Flat format
      const newSkillObj = { name: trimmed, level: 'Proficient' };
      onChange({ ...resumeData, skills: [...skills, newSkillObj] });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (groupIndex, itemIndex) => {
    if (skills.length > 0 && skills[0].items) {
      const updated = [...skills];
      const targetGroup = { ...updated[groupIndex] };
      targetGroup.items = targetGroup.items.filter((_, i) => i !== itemIndex);
      updated[groupIndex] = targetGroup;
      onChange({ ...resumeData, skills: updated });
    } else {
      const updated = skills.filter((_, i) => i !== groupIndex);
      onChange({ ...resumeData, skills: updated });
    }
  };

  // Projects handlers
  const handleProjectChange = (idx, field, value) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...resumeData, projects: updated });
  };

  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: 'Project Name',
      link: 'https://github.com/username/project',
      technologies: ['React', 'Node.js'],
      description: 'Describe the problem solved, architecture, and results.',
      highlights: []
    };
    onChange({ ...resumeData, projects: [newProj, ...projects] });
  };

  const handleRemoveProject = (idx) => {
    const updated = projects.filter((_, i) => i !== idx);
    onChange({ ...resumeData, projects: updated });
  };

  // Certifications handlers
  const handleCertChange = (idx, field, value) => {
    const updated = [...certifications];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...resumeData, certifications: updated });
  };

  const handleAddCert = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: 'Certificate Name',
      issuer: 'Issuing Organization',
      date: '2024',
      url: ''
    };
    onChange({ ...resumeData, certifications: [newCert, ...certifications] });
  };

  const handleRemoveCert = (idx) => {
    const updated = certifications.filter((_, i) => i !== idx);
    onChange({ ...resumeData, certifications: updated });
  };

  // Languages handlers
  const handleLangChange = (idx, field, value) => {
    const updated = [...languages];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...resumeData, languages: updated });
  };

  const handleAddLang = () => {
    const newLang = {
      name: 'Language Name',
      level: 'Fluent'
    };
    onChange({ ...resumeData, languages: [...languages, newLang] });
  };

  const handleRemoveLang = (idx) => {
    const updated = languages.filter((_, i) => i !== idx);
    onChange({ ...resumeData, languages: updated });
  };

  return (
    <div className="w-full lg:w-[440px] xl:w-[480px] bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-20 shrink-0 print-hide">
      {/* Panel Top Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-red animate-pulse"></span>
            <h2 className="font-bold text-gray-900 text-base">Resume Content Editor</h2>
          </div>

          <div className="flex items-center gap-1.5">
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-theme-red/30 cursor-pointer disabled:opacity-50"
                title="Save Changes"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save</span>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
                title="Close Editor"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Resume Title Input */}
        {onTitleChange && (
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Resume Title
            </label>
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:border-theme-red focus:ring-1 focus:ring-theme-red outline-none transition"
            />
          </div>
        )}

        {/* Storage Isolation Reassurance Badge */}
        <div className="px-3 py-1.5 bg-blue-50/80 border border-blue-200/60 rounded-xl flex items-start gap-2 text-[11px] text-blue-800">
          <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
          <span className="leading-tight">
            <strong>Resume-only copy:</strong> Any alterations here are saved to this resume and will <strong>not</strong> affect your account profile.
          </span>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-theme-red/10 text-theme-red font-bold'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Contact & Header Details
              </h3>
              <select
                defaultValue=""
                onChange={(e) => {
                  const choice = e.target.value;
                  if (!choice) return;
                  const name = profilePersonal.name || profileAuth.name || '';
                  const role = profilePersonal.role || '';
                  const email = profilePersonal.email || profileAuth.email || '';
                  const phone = profilePersonal.phoneNo || '';
                  const loc = profilePersonal.location || '';
                  const linkedin = profilePersonal.linkedinUrl || '';
                  const github = profilePersonal.githubUrl || '';
                  const website = profilePersonal.portfolioUrl || '';
                  const photo = profilePersonal.photoUrl || '';

                  if (choice === 'all') {
                    handlePersonalUpdate({
                      name, fullName: name,
                      title: role, jobTitle: role,
                      email, phone,
                      location: loc, city: loc,
                      linkedin, github,
                      website, portfolio: website,
                      avatar: photo, photoUrl: photo
                    });
                  } else if (choice === 'name') handlePersonalUpdate({ name, fullName: name });
                  else if (choice === 'role') handlePersonalUpdate({ title: role, jobTitle: role });
                  else if (choice === 'email') handlePersonalUpdate({ email });
                  else if (choice === 'phone') handlePersonalUpdate({ phone });
                  else if (choice === 'location') handlePersonalUpdate({ location: loc, city: loc });
                  else if (choice === 'linkedin') handlePersonalUpdate({ linkedin });
                  else if (choice === 'github') handlePersonalUpdate({ github });
                  else if (choice === 'website') handlePersonalUpdate({ website, portfolio: website });
                  else if (choice === 'photo') handlePersonalUpdate({ avatar: photo, photoUrl: photo });

                  e.target.value = '';
                }}
                disabled={!profileData}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[210px] truncate disabled:opacity-50"
              >
                <option value="" disabled>Import from Profile...</option>
                <option value="all">⚡ Import All Profile Details</option>
                {(profilePersonal.name || profileAuth.name) && (
                  <option value="name">Name: {profilePersonal.name || profileAuth.name}</option>
                )}
                {profilePersonal.role && (
                  <option value="role">Role: {profilePersonal.role}</option>
                )}
                {(profilePersonal.email || profileAuth.email) && (
                  <option value="email">Email: {profilePersonal.email || profileAuth.email}</option>
                )}
                {profilePersonal.phoneNo && (
                  <option value="phone">Phone: {profilePersonal.phoneNo}</option>
                )}
                {profilePersonal.location && (
                  <option value="location">Location: {profilePersonal.location}</option>
                )}
                {profilePersonal.linkedinUrl && (
                  <option value="linkedin">LinkedIn</option>
                )}
                {profilePersonal.githubUrl && (
                  <option value="github">GitHub</option>
                )}
                {profilePersonal.portfolioUrl && (
                  <option value="website">Portfolio URL</option>
                )}
                {profilePersonal.photoUrl && (
                  <option value="photo">Profile Photo</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={personal.name !== undefined && personal.name !== null ? personal.name : (personal.fullName || '')}
                  onChange={(e) => {
                    handlePersonalUpdate({
                      name: e.target.value,
                      fullName: e.target.value
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Headline / Target Role</label>
                <input
                  type="text"
                  value={personal.title !== undefined && personal.title !== null ? personal.title : (personal.jobTitle || '')}
                  onChange={(e) => {
                    handlePersonalUpdate({
                      title: e.target.value,
                      jobTitle: e.target.value
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="e.g. Lead Frontend Architect"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={personal.email || ''}
                  onChange={(e) => handlePersonalUpdate({ email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={personal.phone || ''}
                  onChange={(e) => handlePersonalUpdate({ phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={personal.location !== undefined && personal.location !== null ? personal.location : (personal.city || '')}
                  onChange={(e) => handlePersonalUpdate({ location: e.target.value, city: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Photo / Avatar URL</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={personal.avatar !== undefined && personal.avatar !== null ? personal.avatar : (personal.photoUrl || '')}
                    onChange={(e) => {
                      handlePersonalUpdate({
                        avatar: e.target.value,
                        photoUrl: e.target.value
                      });
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                    placeholder="https://..."
                  />
                  {(personal.avatar || personal.photoUrl) && (
                    <img
                      src={personal.avatar || personal.photoUrl}
                      alt="Preview"
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={personal.linkedin || ''}
                  onChange={(e) => handlePersonalUpdate({ linkedin: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">GitHub</label>
                <input
                  type="text"
                  value={personal.github || ''}
                  onChange={(e) => handlePersonalUpdate({ github: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="github.com/..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Portfolio / Website</label>
                <input
                  type="text"
                  value={personal.website !== undefined && personal.website !== null ? personal.website : (personal.portfolio || '')}
                  onChange={(e) => handlePersonalUpdate({
                    website: e.target.value,
                    portfolio: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none transition"
                  placeholder="myportfolio.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFESSIONAL SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Professional Bio / Summary
              </h3>
              <select
                defaultValue=""
                onChange={(e) => {
                  const choice = e.target.value;
                  if (!choice) return;
                  if (choice === 'profile_summary') {
                    const bio = profileData?.summary || profilePersonal.summary || profilePersonal.about || '';
                    if (bio) handleSummaryChange(bio);
                  } else if (choice === 'generated') {
                    const role = profilePersonal.role || personal.title || personal.jobTitle || 'Software Engineer';
                    const gen = `Motivated and results-driven ${role} with expertise in building scalable, performant applications and delivering user-centric digital experiences.`;
                    handleSummaryChange(gen);
                  }
                  e.target.value = '';
                }}
                disabled={!profileData}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[210px] truncate disabled:opacity-50"
              >
                <option value="" disabled>Import Summary...</option>
                {(profileData?.summary || profilePersonal.summary || profilePersonal.about) && (
                  <option value="profile_summary">Use Profile Bio</option>
                )}
                <option value="generated">
                  Generate for {profilePersonal.role || personal.title || 'Role'}
                </option>
              </select>
            </div>

            <textarea
              rows={8}
              value={summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-800 focus:bg-white focus:border-theme-red outline-none resize-y"
              placeholder="Write a compelling 2-4 sentence executive summary highlighting your experience, key strengths, and achievements..."
            />
          </div>
        )}

        {/* TAB 3: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Experience History ({experience.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === '__all__') {
                      const toAdd = profileExperiences.map((w) => ({
                        id: `exp-${Date.now()}-${w.id || Math.random()}`,
                        role: w.jobTitle || 'Job Title',
                        company: w.companyName || 'Company Name',
                        location: w.location || '',
                        startDate: getYearOrDate(w.joinDate),
                        endDate: w.endDate ? getYearOrDate(w.endDate) : (w.currentWorking ? 'Present' : ''),
                        current: Boolean(w.currentWorking || w.endDate === 'Present'),
                        description: w.description || '',
                        highlights: Array.isArray(w.technologies) && w.technologies.length > 0
                          ? [`Key technologies: ${w.technologies.join(', ')}`]
                          : (w.description ? [] : ['Key accomplishment or impact metric.'])
                      }));
                      onChange({ ...resumeData, experience: [...toAdd, ...experience] });
                    } else {
                      const w = profileExperiences.find((item) => String(item.id) === val);
                      if (w) {
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          role: w.jobTitle || 'Job Title',
                          company: w.companyName || 'Company Name',
                          location: w.location || '',
                          startDate: getYearOrDate(w.joinDate),
                          endDate: w.endDate ? getYearOrDate(w.endDate) : (w.currentWorking ? 'Present' : ''),
                          current: Boolean(w.currentWorking || w.endDate === 'Present'),
                          description: w.description || '',
                          highlights: Array.isArray(w.technologies) && w.technologies.length > 0
                            ? [`Key technologies: ${w.technologies.join(', ')}`]
                            : (w.description ? [] : ['Key accomplishment or impact metric.'])
                        };
                        onChange({ ...resumeData, experience: [newExp, ...experience] });
                      }
                    }
                    e.target.value = '';
                  }}
                  disabled={profileExperiences.length === 0}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
                >
                  <option value="" disabled>
                    {profileExperiences.length > 0 ? `+ Profile Experience (${profileExperiences.length})...` : 'No profile experience'}
                  </option>
                  {profileExperiences.length > 1 && (
                    <option value="__all__">+ Add All from Profile ({profileExperiences.length})</option>
                  )}
                  {profileExperiences.map((w) => {
                    const isAdded = experience.some((ex) => (ex.role || '').toLowerCase() === (w.jobTitle || '').toLowerCase() && (ex.company || '').toLowerCase() === (w.companyName || '').toLowerCase());
                    return (
                      <option key={w.id} value={w.id}>
                        {w.jobTitle || 'Role'} - {w.companyName || 'Company'} {isAdded ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1 text-xs font-bold text-theme-red hover:text-theme-red/80 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {experience.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Role / Title</label>
                      <input
                        type="text"
                        value={exp.role || ''}
                        onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-theme-red"
                        placeholder="Role"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Company</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none focus:border-theme-red"
                        placeholder="Company"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Delete Position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="2022"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate || ''}
                      onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="Present"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Location</label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Description / Overview</label>
                  <textarea
                    rows={2}
                    value={exp.description || ''}
                    onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red resize-y"
                    placeholder="Brief description of responsibilities..."
                  />
                </div>

                {/* Highlights / Bullet points */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-gray-600">Bullet Points / Accomplishments</span>
                    <button
                      type="button"
                      onClick={() => handleAddExpHighlight(idx)}
                      className="text-[10px] font-bold text-theme-red hover:underline"
                    >
                      + Add Bullet
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {(exp.highlights || []).map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-xs">•</span>
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => handleUpdateExpHighlight(idx, hIdx, e.target.value)}
                          className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                          placeholder="Accomplished X resulting in Y..."
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExpHighlight(idx, hIdx)}
                          className="p-1 text-gray-300 hover:text-red-500 rounded"
                          title="Remove Bullet"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Education ({education.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === '__all__') {
                      const toAdd = profileEducations.map((ed) => ({
                        id: `edu-${Date.now()}-${ed.id || Math.random()}`,
                        degree: [ed.specialization, ed.educationType].filter(Boolean).join(' in ') || ed.educationType || 'Degree',
                        institution: ed.instituteName || ed.boardOrUniversity || 'University Name',
                        location: '',
                        startDate: ed.startYear ? String(ed.startYear) : '',
                        endDate: ed.endYear ? String(ed.endYear) : '',
                        gpa: ed.score ? `${ed.score}${ed.scoreType ? ` (${ed.scoreType})` : ''}` : '',
                        highlights: []
                      }));
                      onChange({ ...resumeData, education: [...toAdd, ...education] });
                    } else {
                      const ed = profileEducations.find((item) => String(item.id) === val);
                      if (ed) {
                        const newEdu = {
                          id: `edu-${Date.now()}`,
                          degree: [ed.specialization, ed.educationType].filter(Boolean).join(' in ') || ed.educationType || 'Degree',
                          institution: ed.instituteName || ed.boardOrUniversity || 'University Name',
                          location: '',
                          startDate: ed.startYear ? String(ed.startYear) : '',
                          endDate: ed.endYear ? String(ed.endYear) : '',
                          gpa: ed.score ? `${ed.score}${ed.scoreType ? ` (${ed.scoreType})` : ''}` : '',
                          highlights: []
                        };
                        onChange({ ...resumeData, education: [newEdu, ...education] });
                      }
                    }
                    e.target.value = '';
                  }}
                  disabled={profileEducations.length === 0}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
                >
                  <option value="" disabled>
                    {profileEducations.length > 0 ? `+ Profile Education (${profileEducations.length})...` : 'No profile education'}
                  </option>
                  {profileEducations.length > 1 && (
                    <option value="__all__">+ Add All from Profile ({profileEducations.length})</option>
                  )}
                  {profileEducations.map((ed) => {
                    const label = [ed.specialization, ed.educationType].filter(Boolean).join(' - ') || ed.educationType || 'Degree';
                    const isAdded = education.some((edu) => (edu.institution || '').toLowerCase() === (ed.instituteName || '').toLowerCase());
                    return (
                      <option key={ed.id} value={ed.id}>
                        {label} ({ed.instituteName || 'Institute'}) {isAdded ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 text-xs font-bold text-theme-red hover:text-theme-red/80 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {education.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Degree / Certification</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-theme-red"
                        placeholder="e.g. B.S. in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                        placeholder="e.g. UC Berkeley"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Delete Education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => handleEducationChange(idx, 'startDate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="2016"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => handleEducationChange(idx, 'endDate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">GPA / Grade</label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleEducationChange(idx, 'gpa', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-theme-red"
                      placeholder="3.8 / 4.0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Skills & Technologies
              </h3>
              <select
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (val === '__all__') {
                    const titles = profileSkills.map((s) => s.title?.trim()).filter(Boolean);
                    if (skills.length > 0 && skills[0].items) {
                      const existing = new Set(skills.flatMap((g) => g.items || []).map((s) => (typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase())));
                      const newTitles = titles.filter((t) => !existing.has(t.toLowerCase()));
                      if (newTitles.length > 0) {
                        const updated = [...skills];
                        updated[0] = { ...updated[0], items: [...updated[0].items, ...newTitles] };
                        onChange({ ...resumeData, skills: updated });
                      }
                    } else {
                      const existing = new Set(skills.map((s) => (typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase())));
                      const newSkills = profileSkills
                        .filter((s) => s.title && !existing.has(s.title.toLowerCase()))
                        .map((s) => ({ name: s.title, level: s.level || 'Proficient' }));
                      if (newSkills.length > 0) {
                        onChange({ ...resumeData, skills: [...skills, ...newSkills] });
                      }
                    }
                  } else {
                    const sk = profileSkills.find((item) => String(item.id) === val);
                    if (sk && sk.title) {
                      if (skills.length > 0 && skills[0].items) {
                        const updated = [...skills];
                        updated[0] = { ...updated[0], items: [...updated[0].items, sk.title] };
                        onChange({ ...resumeData, skills: updated });
                      } else {
                        onChange({ ...resumeData, skills: [...skills, { name: sk.title, level: sk.level || 'Proficient' }] });
                      }
                    }
                  }
                  e.target.value = '';
                }}
                disabled={profileSkills.length === 0}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
              >
                <option value="" disabled>
                  {profileSkills.length > 0 ? `+ Profile Skills (${profileSkills.length})...` : 'No profile skills'}
                </option>
                {profileSkills.length > 1 && (
                  <option value="__all__">+ Add All from Profile ({profileSkills.length})</option>
                )}
                {profileSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.level || 'Proficient'})
                  </option>
                ))}
              </select>
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-theme-red outline-none"
                placeholder="Type skill name and press Enter..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Render Skill Tags */}
            {skills.length > 0 && skills[0].items ? (
              // Grouped Skills
              <div className="space-y-3">
                {skills.map((grp, gIdx) => (
                  <div key={gIdx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <span className="text-xs font-bold text-gray-700">
                      {grp.category || grp.name || `Group ${gIdx + 1}`}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(grp.items || []).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 shadow-2xl"
                        >
                          <span>{typeof sk === 'string' ? sk : (sk.title || sk.name || '')}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(gIdx, sIdx)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Flat Skills
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk, sIdx) => {
                  const name = typeof sk === 'string' ? sk : (sk.title || sk.name || '');
                  return (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sIdx)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Featured Projects ({projects.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === '__all__') {
                      const toAdd = profileProjects.map((p) => ({
                        id: `proj-${Date.now()}-${p.id || Math.random()}`,
                        name: p.title || 'Project Name',
                        link: p.projectLink || '',
                        technologies: parseTech(p.technologies),
                        description: p.description || '',
                        highlights: []
                      }));
                      onChange({ ...resumeData, projects: [...toAdd, ...projects] });
                    } else {
                      const p = profileProjects.find((item) => String(item.id) === val);
                      if (p) {
                        const newProj = {
                          id: `proj-${Date.now()}`,
                          name: p.title || 'Project Name',
                          link: p.projectLink || '',
                          technologies: parseTech(p.technologies),
                          description: p.description || '',
                          highlights: []
                        };
                        onChange({ ...resumeData, projects: [newProj, ...projects] });
                      }
                    }
                    e.target.value = '';
                  }}
                  disabled={profileProjects.length === 0}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
                >
                  <option value="" disabled>
                    {profileProjects.length > 0 ? `+ Profile Projects (${profileProjects.length})...` : 'No profile projects'}
                  </option>
                  {profileProjects.length > 1 && (
                    <option value="__all__">+ Add All from Profile ({profileProjects.length})</option>
                  )}
                  {profileProjects.map((p) => {
                    const isAdded = projects.some((pr) => (pr.name || '').toLowerCase() === (p.title || '').toLowerCase());
                    return (
                      <option key={p.id} value={p.id}>
                        {p.title || 'Untitled Project'} {isAdded ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1 text-xs font-bold text-theme-red hover:text-theme-red/80 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.name || ''}
                        onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-theme-red"
                        placeholder="Project Name"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={
                          Array.isArray(proj.technologies)
                            ? proj.technologies.join(', ')
                            : proj.technologies || ''
                        }
                        onChange={(e) =>
                          handleProjectChange(
                            idx,
                            'technologies',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                        placeholder="React, TypeScript, Spring Boot"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Project Link / Repo URL</label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => handleProjectChange(idx, 'link', e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red resize-y"
                    placeholder="Impact, problem statement, key metrics..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Certifications ({certifications.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === '__all__') {
                      const toAdd = profileCertifications.map((c) => ({
                        id: `cert-${Date.now()}-${c.id || Math.random()}`,
                        name: c.title || 'Certificate Name',
                        issuer: c.issuedBy || '',
                        date: c.issueDate ? getYearOrDate(c.issueDate) : '',
                        url: c.url || ''
                      }));
                      onChange({ ...resumeData, certifications: [...toAdd, ...certifications] });
                    } else {
                      const c = profileCertifications.find((item) => String(item.id) === val);
                      if (c) {
                        const newCert = {
                          id: `cert-${Date.now()}`,
                          name: c.title || 'Certificate Name',
                          issuer: c.issuedBy || '',
                          date: c.issueDate ? getYearOrDate(c.issueDate) : '',
                          url: c.url || ''
                        };
                        onChange({ ...resumeData, certifications: [newCert, ...certifications] });
                      }
                    }
                    e.target.value = '';
                  }}
                  disabled={profileCertifications.length === 0}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
                >
                  <option value="" disabled>
                    {profileCertifications.length > 0 ? `+ Profile Certs (${profileCertifications.length})...` : 'No profile certs'}
                  </option>
                  {profileCertifications.length > 1 && (
                    <option value="__all__">+ Add All from Profile ({profileCertifications.length})</option>
                  )}
                  {profileCertifications.map((c) => {
                    const isAdded = certifications.some((cr) => (cr.name || '').toLowerCase() === (c.title || '').toLowerCase());
                    return (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.issuedBy || 'Issuer'}) {isAdded ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={handleAddCert}
                  className="flex items-center gap-1 text-xs font-bold text-theme-red hover:text-theme-red/80 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {certifications.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Certification Title</label>
                      <input
                        type="text"
                        value={cert.name || ''}
                        onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-theme-red"
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer || ''}
                          onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Date</label>
                        <input
                          type="text"
                          value={cert.date || ''}
                          onChange={(e) => handleCertChange(idx, 'date', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                          placeholder="2023"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCert(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: LANGUAGES */}
        {activeTab === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Languages ({languages.length})
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val === '__all__') {
                      const toAdd = profileLanguages.map((l) => ({
                        name: l.language || l.name || 'Language',
                        level: l.level || 'Fluent'
                      }));
                      onChange({ ...resumeData, languages: [...languages, ...toAdd] });
                    } else {
                      const l = profileLanguages.find((item) => String(item.id) === val);
                      if (l) {
                        const newLang = {
                          name: l.language || l.name || 'Language',
                          level: l.level || 'Fluent'
                        };
                        onChange({ ...resumeData, languages: [...languages, newLang] });
                      }
                    }
                    e.target.value = '';
                  }}
                  disabled={profileLanguages.length === 0}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none hover:border-theme-red focus:border-theme-red transition cursor-pointer max-w-[180px] truncate disabled:opacity-50"
                >
                  <option value="" disabled>
                    {profileLanguages.length > 0 ? `+ Profile Languages (${profileLanguages.length})...` : 'No profile languages'}
                  </option>
                  {profileLanguages.length > 1 && (
                    <option value="__all__">+ Add All from Profile ({profileLanguages.length})</option>
                  )}
                  {profileLanguages.map((l) => {
                    const langName = l.language || l.name;
                    const isAdded = languages.some((lr) => (lr.name || '').toLowerCase() === (langName || '').toLowerCase());
                    return (
                      <option key={l.id} value={l.id}>
                        {langName} ({l.level || 'Fluent'}) {isAdded ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>

                <button
                  type="button"
                  onClick={handleAddLang}
                  className="flex items-center gap-1 text-xs font-bold text-theme-red hover:text-theme-red/80 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Language</label>
                    <input
                      type="text"
                      value={lang.name || ''}
                      onChange={(e) => handleLangChange(idx, 'name', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-theme-red"
                      placeholder="English"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Proficiency</label>
                    <select
                      value={lang.level || 'Fluent'}
                      onChange={(e) => handleLangChange(idx, 'level', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-theme-red"
                    >
                      <option value="Native / Bilingual">Native / Bilingual</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Professional Working">Professional Working</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Elementary">Elementary</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveLang(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                  title="Delete Language"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel Bottom Footer */}
      {lastSaved && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/70 text-[11px] text-gray-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
          <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
        </div>
      )}
    </div>
  );
}
