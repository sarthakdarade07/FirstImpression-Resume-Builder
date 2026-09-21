import api from '../../../api/axios';
import { fallbackTemplates, modernSidebarTemplate } from '../data/localTemplates';

/**
 * Service for fetching and interacting with backend resume templates.
 */
export const templateApi = {
  /**
   * Fetches active templates (paginated or list)
   * Falls back to local templates if backend is unreachable.
   */
  async getTemplates(page = 0, size = 20) {
    try {
      const response = await api.get(`/api/templates`, {
        params: { page, size }
      });
      // Response might be a Spring Page or List
      const data = response.data;
      if (data?.content && Array.isArray(data.content)) {
        return data.content;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return fallbackTemplates;
    } catch (error) {
      console.warn('[templateApi] Failed to fetch templates from backend, using local fallbacks:', error.message);
      return fallbackTemplates;
    }
  },

  /**
   * Fetches full template details (including HTML code and CSS) by slug
   * @param {string} slug
   */
  async getTemplateBySlug(slug) {
    try {
      let response;
      try {
        response = await api.get(`/api/templates/slug/${slug}`);
      } catch (err) {
        response = await api.get(`/api/templates/${slug}`);
      }
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn(`[templateApi] Failed to fetch template '${slug}' from backend, using local fallback:`, error.message);
    }

    // Fallback to local
    const matched = fallbackTemplates.find(t => t.slug === slug);
    return matched || modernSidebarTemplate;
  },

  /**
   * Fetches raw HTML code for a template
   * @param {string} slug
   */
  async getTemplateHtml(slug) {
    try {
      const response = await api.get(`/api/templates/${slug}/html`, {
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      const matched = fallbackTemplates.find(t => t.slug === slug);
      return matched?.htmlCode || matched?.html || null;
    }
  },

  /**
   * Fetches raw scoped CSS for a template
   * @param {string} slug
   */
  async getTemplateCss(slug) {
    try {
      const response = await api.get(`/api/templates/${slug}/css`, {
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      const matched = fallbackTemplates.find(t => t.slug === slug);
      return matched?.cssText || matched?.css || '';
    }
  }
};

export default templateApi;
