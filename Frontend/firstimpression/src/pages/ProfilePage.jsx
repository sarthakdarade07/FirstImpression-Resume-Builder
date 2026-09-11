import React, { useState } from 'react';
import { Loader2, User, Briefcase, GraduationCap, Wrench, Globe, Folder, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import SidebarPageLayout from '../components/dashboard/SidebarPageLayout';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { useProfileLogic } from '../components/profile/hooks/useProfileLogic';

import ProfileBasicInfo from '../components/profile/ProfileBasicInfo';
import ProfileExperience from '../components/profile/ProfileExperience';
import ProfileEducation from '../components/profile/ProfileEducation';
import ProfileSkills from '../components/profile/ProfileSkills';
import ProfileProjects from '../components/profile/ProfileProjects';
import ProfileLanguages from '../components/profile/ProfileLanguages';
import ProfileCertifications from '../components/profile/ProfileCertifications';

const ProfilePage = () => {
  const {
    profileData,
    loading,
    error,
    basicInfo,
    user,
    educationTypes,
    scoreTypes,
    showToast,
    toastMsg,
    isSuccess,
    deleteModalState,
    openDeleteModal,
    closeDeleteModal,
    savePersonalInformation,
    saveEducation,
    saveExperience,
    saveSkills,
    saveProjects,
    saveLanguages,
    saveCertifications,
  } = useProfileLogic();

  const [activeTab, setActiveTab] = useState('basicInfo');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-[var(--theme-red)] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl inline-block font-semibold border border-red-100 shadow-sm">
            Error loading profile: {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const sections = [
    {
      title: 'Resume Sections',
      items: [
        { id: 'basicInfo', label: 'Basic Info', icon: User },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'languages', label: 'Languages', icon: Globe },
        { id: 'projects', label: 'Projects', icon: Folder },
        { id: 'certifications', label: 'Certifications', icon: Award },
      ],
    },
  ];

  return (
    <>
      <SidebarPageLayout
        title="Profile Overview"
        subtitle="Manage your personal information and resume details."
        sections={sections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      >
        {activeTab === 'basicInfo' && (
          <ProfileBasicInfo
            data={basicInfo}
            onSave={savePersonalInformation}
          />
        )}
        {activeTab === 'experience' && (
          <ProfileExperience
            experience={profileData?.workExperiences}
            onSave={saveExperience}
            onDeleteModal={openDeleteModal}
          />
        )}
        {activeTab === 'education' && (
          <ProfileEducation
            education={profileData?.educations}
            educationTypes={educationTypes}
            scoreTypes={scoreTypes}
            onSave={saveEducation}
            onDeleteModal={openDeleteModal}
          />
        )}
        {activeTab === 'skills' && (
          <ProfileSkills
            skills={profileData?.skills}
            onSave={saveSkills}
            onDeleteModal={openDeleteModal}
          />
        )}
        {activeTab === 'languages' && (
          <ProfileLanguages
            languages={profileData?.languages}
            onSave={saveLanguages}
            onDeleteModal={openDeleteModal}
          />
        )}
        {activeTab === 'projects' && (
          <ProfileProjects
            projects={profileData?.projects}
            onSave={saveProjects}
            onDeleteModal={openDeleteModal}
          />
        )}
        {activeTab === 'certifications' && (
          <ProfileCertifications
            certifications={profileData?.certifications}
            onSave={saveCertifications}
            onDeleteModal={openDeleteModal}
          />
        )}
      </SidebarPageLayout>

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        isLoading={deleteModalState.isLoading}
        onConfirm={deleteModalState.onConfirm}
        onClose={closeDeleteModal}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              isSuccess
                ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
                : 'bg-red-50/95 text-red-800 border-red-200 shadow-red-500/10'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;
