import api from '../api/axios';
import { sampleResumeData } from '../components/templates/data/sampleResumeData';

const ACTIVE_DRAFT_KEY = 'firstimpression_active_resume_draft';

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
  const phone = pi.phoneNo || pi.phone || '';
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

  const skills = (profile?.skills || []).map((s) => {
    const skillText = typeof s === 'string' ? s : (s.title || s.name || s.skill || s.skillName || '');
    return {
      name: skillText,
      title: skillText,
      level: s.level || s.proficiency || 'Proficient'
    };
  }).filter((s) => Boolean(s.name));

  const projects = (profile?.projects || []).map((p, idx) => {
    const rawTech = p.technologies || p.skills || [];
    const techArray = Array.isArray(rawTech)
      ? rawTech
      : (typeof rawTech === 'string' ? rawTech.split(',').map((item) => item.trim()).filter(Boolean) : []);
    const projLink = p.projectLink || p.link || p.url || '';
    return {
      id: p.id || `proj-${idx}`,
      name: p.title || p.name || 'Project',
      title: p.title || p.name || 'Project',
      technologies: techArray,
      link: projLink,
      projectLink: projLink,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      description: p.description || '',
      highlights: p.highlights || []
    };
  });

  const certifications = (profile?.certifications || []).map((c, idx) => {
    const certUrl = c.url || c.certificateUrl || c.link || '';
    const issuerName = c.issuedBy || c.organization || c.issuer || '';
    const issueDate = c.issueDate || c.date || '';
    return {
      id: c.id || `cert-${idx}`,
      name: c.title || c.name || 'Certification',
      title: c.title || c.name || 'Certification',
      issuer: issuerName,
      issuedBy: issuerName,
      date: issueDate,
      issueDate: issueDate,
      url: certUrl,
      link: certUrl
    };
  });

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
   * Retrieves the current active draft from localStorage
   */
  getActiveDraft() {
    try {
      const stored = localStorage.getItem(ACTIVE_DRAFT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Sets the current active draft in localStorage
   */
  setActiveDraft(resume) {
    try {
      if (resume) {
        localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(resume));
      }
    } catch (e) {
      console.warn('[resumeApi] Failed to write active draft to local storage:', e);
    }
  },

  /**
   * Removes the active draft from localStorage upon closing editor
   */
  clearActiveDraft() {
    try {
      localStorage.removeItem(ACTIVE_DRAFT_KEY);
      localStorage.removeItem('firstimpression_user_resumes');
    } catch {}
  },

  /**
   * Get all resumes for the current user (strictly database-backed)
   */
  async getUserResumes() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const response = await api.get('/api/resumes');
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend /api/resumes failed:', err.message);
      }
    }
    // Clean up any legacy full-list storage
    try {
      localStorage.removeItem('firstimpression_user_resumes');
    } catch {}
    return [];
  },

  /**
   * Create a new resume using a given template and the user's profile details or provided initial data
   * @param {Object} template - Template object { slug, name, ... }
   * @param {string} [customTitle]
   * @param {Object} [customResumeData] - Optional pre-existing or customized resume data to seed with
   */
  async createResumeFromTemplate(template, customTitle, customResumeData = null, user = null) {
    let resumeData = null;
    const token = localStorage.getItem('jwtToken');

    if (customResumeData) {
      resumeData = JSON.parse(JSON.stringify(customResumeData));
    } else {
      let profileData = null;
      let authUser = user;

      if (!authUser) {
        try {
          const rawUser = localStorage.getItem('user');
          if (rawUser) authUser = JSON.parse(rawUser);
        } catch {}
      }

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
        console.warn('[resumeApi] Backend save failed, keeping current draft locally:', err.message);
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

    // Store ONLY the current working resume in localStorage
    this.setActiveDraft(createdResume);

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
          this.setActiveDraft(response.data);
          return response.data;
        }
      } catch (err) {
        console.warn('[resumeApi] Backend getResumeById failed, checking active draft:', err.message);
      }
    }

    // Check if the currently active draft matches
    const active = this.getActiveDraft();
    if (active && String(active.id) === String(id)) {
      return active;
    }
    return null;
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
        console.warn('[resumeApi] Backend updateResume failed, updating active draft:', err.message);
      }
    }

    // Update active draft if it matches the current resume being edited
    const active = this.getActiveDraft();
    if (active && String(active.id) === String(id)) {
      const merged = {
        ...active,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.setActiveDraft(merged);
      if (!updatedResume) updatedResume = merged;
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

    // Clear active draft if the deleted resume was active
    const active = this.getActiveDraft();
    if (active && String(active.id) === String(id)) {
      this.clearActiveDraft();
    }
  },

  /**
   * Tailor a resume to its associated Job Description via Gemini
   * @param {string} id - Resume ID
   * @returns {Promise<Object>} Tailor response with alteredResumeData,  gapInJdAndResume, requiredSkills
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
