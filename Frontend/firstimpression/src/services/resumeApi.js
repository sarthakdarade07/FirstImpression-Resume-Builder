import api from '../api/axios';
import { sampleResumeData } from '../components/templates/data/sampleResumeData';

const LOCAL_STORAGE_KEY = 'firstimpression_user_resumes';

/**
 * Transforms backend ProfileResponse into universal Resume Data Schema
 * @param {Object} profile - Data from /api/profile/get-profile
 * @param {Object} [user] - Redux auth user
 * @returns {Object} Resume Data JSON
 */
export function transformProfileToResumeData(profile = {}, user = {}) {
  const pi = profile?.personalInformation || {};
  const auth = profile?.authResponse || {};

  const name = pi.name || user?.name || auth.name || 'Your Name';
  const role = pi.role || 'Professional';
  const email = pi.email || user?.email || auth.email || '';
  const phone = pi.phoneNo || '';
  const location = pi.location || '';
  const photoUrl = pi.photoUrl || user?.profileImageUrl || '';

  const summary =
    profile?.summary ||
    pi.summary ||
    `Motivated ${role} with a proven track record of delivering impactful results and driving technical excellence.`;

  const experience = (profile?.workExperiences || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx}`,
    role: exp.role || 'Role',
    company: exp.organization || 'Company',
    location: exp.location || '',
    startDate: exp.startDate || '',
    endDate: exp.currentWorking ? 'Present' : exp.endDate || '',
    current: Boolean(exp.currentWorking),
    description: exp.jobDescription || '',
    highlights: exp.highlights || []
  }));

  const education = (profile?.educations || []).map((edu, idx) => ({
    id: edu.id || `edu-${idx}`,
    institution: edu.institution || 'University',
    degree: edu.degree || '',
    fieldOfStudy: edu.fieldOfStudy || '',
    startDate: edu.startDate || '',
    endDate: edu.currentlyStudying ? 'Present' : edu.endDate || '',
    gpa: edu.score ? `${edu.score} ${edu.scoreType || ''}`.trim() : '',
    highlights: edu.highlights || []
  }));

  const skills = (profile?.skills || []).map((s) => ({
    name: s.name,
    level: s.proficiency || 'Proficient'
  }));

  const projects = (profile?.projects || []).map((p, idx) => ({
    id: p.id || `proj-${idx}`,
    name: p.title || 'Project',
    technologies: p.skills ? (Array.isArray(p.skills) ? p.skills : p.skills.split(',').map((item) => item.trim())) : [],
    link: p.link || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    description: p.description || '',
    highlights: p.highlights || []
  }));

  const certifications = (profile?.certifications || []).map((c, idx) => ({
    id: c.id || `cert-${idx}`,
    name: c.title || 'Certification',
    issuer: c.organization || '',
    date: c.issueDate || '',
    url: c.certificateUrl || ''
  }));

  const languages = (profile?.languages || []).map((l) => ({
    name: l.language || l.name,
    level: l.proficiency || l.level || 'Fluent'
  }));

  // If user profile is empty, merge with sensible defaults from sample
  return {
    personal: {
      name,
      fullName: name,
      title: role,
      jobTitle: role,
      email,
      phone,
      location,
      linkedin: pi.linkedinUrl || '',
      github: pi.githubUrl || '',
      website: pi.portfolioUrl || '',
      photoUrl,
      avatar: photoUrl
    },
    summary,
    experience: experience.length > 0 ? experience : sampleResumeData.experience,
    education: education.length > 0 ? education : sampleResumeData.education,
    skills: skills.length > 0 ? skills : sampleResumeData.skills,
    projects: projects.length > 0 ? projects : sampleResumeData.projects,
    certifications: certifications.length > 0 ? certifications : sampleResumeData.certifications,
    languages: languages.length > 0 ? languages : sampleResumeData.languages
  };
}

/**
 * Service for creating and retrieving resumes
 */
export const resumeApi = {
  /**
   * Get all resumes for the current user
   */
  async getUserResumes() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const response = await api.get('/api/resumes');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend /api/resumes failed, using local storage:', err.message);
      }
    }

    // Fallback to local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new resume using a given template and the user's profile details or provided initial data
   * @param {Object} template - Template object { slug, name, ... }
   * @param {string} [customTitle]
   * @param {Object} [customResumeData] - Optional pre-existing or customized resume data to seed with
   */
  async createResumeFromTemplate(template, customTitle, customResumeData = null) {
    let resumeData = null;
    const token = localStorage.getItem('jwtToken');

    if (customResumeData) {
      resumeData = JSON.parse(JSON.stringify(customResumeData));
    } else {
      let profileData = null;
      let authUser = null;

      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) authUser = JSON.parse(rawUser);
      } catch {}

      if (token) {
        try {
          const profileRes = await api.get('/api/profile/get-profile');
          profileData = profileRes.data?.message || profileRes.data;
        } catch (err) {
          console.warn('[resumeApi] Failed to fetch profile from backend, using available user details:', err.message);
        }
      }

      // Generate populated resume data snapshot from profile
      resumeData = transformProfileToResumeData(profileData, authUser);
    }

    const title = customTitle || `${template.name} Resume`;

    const resumePayload = {
      templateSlug: template.slug,
      title,
      resumeDataJson: JSON.stringify(resumeData)
    };

    let createdResume = null;

    if (token) {
      try {
        const res = await api.post('/api/resumes', resumePayload);
        if (res.data) {
          createdResume = res.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend save failed, saving locally:', err.message);
      }
    }

    // If backend wasn't available or errored, create local representation
    if (!createdResume) {
      createdResume = {
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        templateSlug: template.slug,
        title,
        resumeDataJson: JSON.stringify(resumeData),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Also persist in localStorage for instant sync across tabs
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const updated = [createdResume, ...existing.filter((r) => r.id !== createdResume.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to write to local storage', e);
    }

    return createdResume;
  },

  /**
   * Fetch a single resume by its ID
   * @param {string} id
   */
  async getResumeById(id) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const response = await api.get(`/api/resumes/${id}`);
        if (response.data) {
          return response.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend getResumeById failed, checking local storage:', err.message);
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      return list.find((r) => String(r.id) === String(id)) || null;
    } catch {
      return null;
    }
  },

  /**
   * Update an existing resume
   * @param {string} id
   * @param {Object} updates - { title, resumeDataJson, templateSlug }
   */
  async updateResume(id, updates) {
    const token = localStorage.getItem('jwtToken');
    let updatedResume = null;

    if (token) {
      try {
        const response = await api.put(`/api/resumes/${id}`, updates);
        if (response.data) {
          updatedResume = response.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend updateResume failed, updating local storage:', err.message);
      }
    }

    // Update local storage
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const index = existing.findIndex((r) => String(r.id) === String(id));
      if (index !== -1) {
        const item = existing[index];
        const merged = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        existing[index] = merged;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
        if (!updatedResume) updatedResume = merged;
      }
    } catch (e) {
      console.warn('Failed to update local storage', e);
    }

    return updatedResume;
  },

  /**
   * Delete a resume
   * @param {string} id
   */
  async deleteResume(id) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        await api.delete(`/api/resumes/${id}`);
      } catch (err) {
        console.warn('[resumeApi] Backend delete failed:', err.message);
      }
    }

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const filtered = existing.filter((r) => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
  },

  /**
   * Tailor a resume to its associated Job Description via Gemini
   * @param {string} id - Resume ID
   * @returns {Promise<Object>} Tailor response with alteredResumeData, reasoning, gapInJdAndResume, requiredSkills
   */
  async tailorResumeToJd(id) {
    if (!id) {
      throw new Error('Resume ID is required to tailor resume.');
    }
    const response = await api.post(`/api/resumes/${id}/tailor-to-jd`, null, {
      timeout: 180000
    });
    return response.data;
  }
};

export default resumeApi;
