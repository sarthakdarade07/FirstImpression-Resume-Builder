import { createAsyncThunk } from "@reduxjs/toolkit";
import { templateApi } from "../../components/templates/services/templateApi";

/**
 * Fetch all available templates.
 * Caches in Redux: skips network request if templates have already been fetched from the backend,
 * unless forceRefresh is explicitly passed.
 */
export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const list = await templateApi.getTemplates();
      return list;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch templates");
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg?.forceRefresh) return true;
      const { template } = getState();
      if (template?.loadingList) return false;
      if (template?.isLoaded) {
        return false; // Skip network call - already cached
      }
      return true;
    },
  }
);

/**
 * Fetch a specific template's details (HTML & CSS) by slug.
 * Caches in Redux: skips network call if template with HTML/CSS is already cached in templatesBySlug.
 */
export const fetchTemplateBySlug = createAsyncThunk(
  "template/fetchTemplateBySlug",
  async (slugArg, { rejectWithValue }) => {
    const slug = typeof slugArg === "object" ? slugArg.slug : slugArg;
    try {
      const templateData = await templateApi.getTemplateBySlug(slug);
      return { slug, template: templateData };
    } catch (err) {
      return rejectWithValue(err.message || `Failed to fetch template ${slug}`);
    }
  },
  {
    condition: (slugArg, { getState }) => {
      const forceRefresh = typeof slugArg === "object" && slugArg?.forceRefresh;
      if (forceRefresh) return true;
      const slug = typeof slugArg === "object" ? slugArg.slug : slugArg;
      const { template } = getState();
      if (template?.loadingTemplate) return false;
      if (template?.templatesBySlug?.[slug]?.htmlCode) {
        return false; // Skip network call - already cached in Redux!
      }
      return true;
    },
  }
);
