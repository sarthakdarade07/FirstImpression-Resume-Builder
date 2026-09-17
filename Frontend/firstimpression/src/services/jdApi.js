import api from '../api/axios';

export const jdApi = {
  /**
   * Uploads a job description file (PDF, DOCX, TXT) or raw text to Gemini JD service
   * @param {Object} params
   * @param {File} [params.file]
   * @param {string} [params.text]
   * @param {string} [params.resumeId]
   */
  async uploadJd({ file, text, resumeId }) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('text', text);
    }
    if (resumeId) {
      formData.append('resumeId', resumeId);
    }

    const response = await api.post('/api/gemini/jd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Updates an existing structured JD or queries it via Gemini
   * @param {number|string} jdId
   * @param {string} query
   */
  async updateJd(jdId, query) {
    const response = await api.post(`/api/gemini/jd/${jdId}/update`, { query }, { timeout: 60000 });
    return response.data;
  },

  /**
   * Fetches existing Job Description for a given resumeId
   * @param {string} resumeId
   */
  async getJdByResumeId(resumeId) {
    const response = await api.get(`/api/ai/jd/resume/${resumeId}`);
    return response.data;
  },
};