import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../../api/axios';
import { setUser } from '../../../redux/slices/authslice';
import { fetchEducationMetadata } from '../../../redux/slices/metadataSlice';

export const useProfileLogic = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read Education Metadata directly from Redux Store
  const { educationTypes, scoreTypes } = useSelector((state) => state.metadata);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  // Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isLoading: false,
  });

  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem('jwtToken');

  const triggerToast = (msg, success = true) => {
    setToastMsg(msg);
    setIsSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const openDeleteModal = ({ title, message, onConfirm }) => {
    setDeleteModalState({
      isOpen: true,
      title: title || 'Delete Entry',
      message: message || 'Are you sure you want to delete this item?',
      onConfirm,
      isLoading: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };

  const fetchProfile = useCallback(async () => {
    try {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await api.get('/api/profile/get-profile');
      const data = response.data;
      setProfileData(data.message || data);
    } catch (err) {
      console.error(err);
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      setError(apiError || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    dispatch(fetchEducationMetadata());
    fetchProfile();
  }, [dispatch, fetchProfile]);

  // 1. Save / Update Personal Information (and User Name)
  const savePersonalInformation = async (formData) => {
    try {
      await api.post('/api/profile/save-personal-information', formData);
      
      // If name was updated, also sync user in Redux
      if (formData.name && user) {
        dispatch(setUser({ ...user, name: formData.name }));
      }

      triggerToast('Personal information updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update personal info';
      triggerToast(msg, false);
      return false;
    }
  };

  // 2. Save Education List
  const saveEducation = async (educationList) => {
    try {
      await api.post('/api/profile/save-education', educationList);
      triggerToast('Education details updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update education';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Education Entry
  const deleteEducation = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-education/${id}`);
      }
      closeDeleteModal();
      triggerToast('Education entry deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete education';
      triggerToast(msg, false);
    }
  };

  // 3. Save Work Experience List
  const saveExperience = async (experienceList) => {
    try {
      await api.post('/api/profile/save-work-experience', experienceList);
      triggerToast('Work experience updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update work experience';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Work Experience Entry
  const deleteExperience = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-work-experience/${id}`);
      }
      closeDeleteModal();
      triggerToast('Work experience entry deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete work experience';
      triggerToast(msg, false);
    }
  };

  // 4. Save Skills List
  const saveSkills = async (skillsList) => {
    try {
      await api.post('/api/profile/save-skills', skillsList);
      triggerToast('Skills updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update skills';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Skill Entry
  const deleteSkill = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-skill/${id}`);
      }
      closeDeleteModal();
      triggerToast('Skill deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete skill';
      triggerToast(msg, false);
    }
  };

  // 5. Save Projects List
  const saveProjects = async (projectsList) => {
    try {
      await api.post('/api/profile/save-projects', projectsList);
      triggerToast('Projects updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update projects';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Project Entry
  const deleteProject = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-project/${id}`);
      }
      closeDeleteModal();
      triggerToast('Project deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete project';
      triggerToast(msg, false);
    }
  };

  // 6. Save Languages List
  const saveLanguages = async (languagesList) => {
    try {
      await api.post('/api/profile/save-languages', languagesList);
      triggerToast('Languages updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update languages';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Language Entry
  const deleteLanguage = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-language/${id}`);
      }
      closeDeleteModal();
      triggerToast('Language deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete language';
      triggerToast(msg, false);
    }
  };

  // 7. Save Certifications List
  const saveCertifications = async (certificationsList) => {
    try {
      await api.post('/api/profile/save-certifications', certificationsList);
      triggerToast('Certifications updated successfully!');
      fetchProfile();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update certifications';
      triggerToast(msg, false);
      return false;
    }
  };

  // Delete Certification Entry
  const deleteCertification = async (id) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isLoading: true }));
      if (id) {
        await api.delete(`/api/profile/delete-certification/${id}`);
      }
      closeDeleteModal();
      triggerToast('Certification deleted successfully!');
      fetchProfile();
    } catch (err) {
      closeDeleteModal();
      const msg = err.response?.data?.message || err.message || 'Failed to delete certification';
      triggerToast(msg, false);
    }
  };

  const basicInfo = {
    ...profileData?.authResponse,
    ...profileData?.personalInformation,
    name: profileData?.personalInformation?.name || user?.name || profileData?.authResponse?.name || '',
    email: profileData?.personalInformation?.email || user?.email || profileData?.authResponse?.email || '',
    role: profileData?.personalInformation?.role || '',
    location: profileData?.personalInformation?.location || '',
    phoneNo: profileData?.personalInformation?.phoneNo || '',
    linkedinUrl: profileData?.personalInformation?.linkedinUrl || '',
    githubUrl: profileData?.personalInformation?.githubUrl || '',
    portfolioUrl: profileData?.personalInformation?.portfolioUrl || '',
    photoUrl: profileData?.personalInformation?.photoUrl || user?.profileImageUrl || '',
  };

  return {
    profileData,
    loading,
    error,
    basicInfo,
    user,
    educationTypes,
    scoreTypes,
    fetchProfile,
    showToast,
    toastMsg,
    isSuccess,
    deleteModalState,
    openDeleteModal,
    closeDeleteModal,
    savePersonalInformation,
    saveEducation,
    deleteEducation,
    saveExperience,
    deleteExperience,
    saveSkills,
    deleteSkill,
    saveProjects,
    deleteProject,
    saveLanguages,
    deleteLanguage,
    saveCertifications,
    deleteCertification,
  };
};