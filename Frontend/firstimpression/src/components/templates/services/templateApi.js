import api from "../../../apis/axios";
import {
  fallbackTemplates,
  modernSidebarTemplate,
} from "../components/data/localTemplates";

// In-memory module cache for templates
const templateMemoryCache = new Map();
let cachedTemplatesList = null;

/**
 * Service for fetching and interacting with backend resume templates with memory caching.
 */
export const templateApi = {
  /**
   * Fetches active templates (paginated or list)
   * Returns from memory cache if already fetched.
   */
  async getTemplates(page = 0, size = 20, forceRefresh = false) {
    if (!forceRefresh && cachedTemplatesList && cachedTemplatesList.length > 0) {
      return cachedTemplatesList;
    }

    try {
      const response = await api.get(`/api/templates`, {
        params: { page, size },
      });
      const data = response.data;
      let list = fallbackTemplates;
      if (data?.content && Array.isArray(data.content)) {
        list = data.content;
      } else if (Array.isArray(data)) {
        list = data;
      }
      cachedTemplatesList = list;
      return list;
    } catch (error) {
      console.warn(
        "[templateApi] Failed to fetch templates from backend, using local fallbacks:",
        error.message,
      );
      return cachedTemplatesList || fallbackTemplates;
    }
  },

  /**
   * Fetches full template details (including HTML code and CSS) by slug.
   * Returns from memory cache if previously requested.
   */
  async getTemplateBySlug(slug, forceRefresh = false) {
    if (!slug) return modernSidebarTemplate;

    if (!forceRefresh && templateMemoryCache.has(slug)) {
      return templateMemoryCache.get(slug);
    }

    try {
      const response = await api.get(`/api/templates/slug/${slug}`);
      if (response && response.data) {
        templateMemoryCache.set(slug, response.data);
        return response.data;
      }
    } catch (error) {
      console.warn(
        `[templateApi] Failed to fetch template '${slug}' from backend, using local fallback:`,
        error.message,
      );
    }

    // Fallback to local
    const matched = fallbackTemplates.find((t) => t.slug === slug) || modernSidebarTemplate;
    templateMemoryCache.set(slug, matched);
    return matched;
  },

  /**
   * Clears the in-memory cache
   */
  clearCache() {
    templateMemoryCache.clear();
    cachedTemplatesList = null;
  },
};

export default templateApi;
