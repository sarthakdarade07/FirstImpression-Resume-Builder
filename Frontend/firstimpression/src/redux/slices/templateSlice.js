import { createSlice } from "@reduxjs/toolkit";
import { fetchTemplates, fetchTemplateBySlug } from "../thunks/templateThunks";
import { fallbackTemplates } from "../../components/templates/components/data/localTemplates";

// Prepopulate fallback templates into memory map
const initialTemplatesBySlug = {};
if (Array.isArray(fallbackTemplates)) {
  fallbackTemplates.forEach((t) => {
    if (t?.slug) {
      initialTemplatesBySlug[t.slug] = t;
    }
  });
}

const initialState = {
  templatesList: fallbackTemplates || [],
  templatesBySlug: initialTemplatesBySlug, // In-memory map: { [slug]: templateData }
  isLoaded: false, // Whether the full templates list was fetched from backend
  activeSlug: "modern-sidebar",
  loadingList: false,
  loadingTemplate: false,
  error: null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setActiveSlug: (state, action) => {
      state.activeSlug = action.payload;
    },
    cacheTemplate: (state, action) => {
      const { slug, template } = action.payload || {};
      if (slug && template) {
        state.templatesBySlug[slug] = template;
      }
    },
    clearTemplateCache: (state) => {
      state.templatesBySlug = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // =========================
      // FETCH ALL TEMPLATES
      // =========================
      .addCase(fetchTemplates.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loadingList = false;
        state.isLoaded = true;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.templatesList = action.payload;
          action.payload.forEach((tpl) => {
            if (tpl?.slug && (tpl.htmlCode || tpl.cssCode)) {
              state.templatesBySlug[tpl.slug] = tpl;
            }
          });
        }
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      // =========================
      // FETCH TEMPLATE BY SLUG
      // =========================
      .addCase(fetchTemplateBySlug.pending, (state) => {
        state.loadingTemplate = true;
        state.error = null;
      })
      .addCase(fetchTemplateBySlug.fulfilled, (state, action) => {
        state.loadingTemplate = false;
        const { slug, template } = action.payload || {};
        if (slug && template) {
          state.templatesBySlug[slug] = template;
        }
      })
      .addCase(fetchTemplateBySlug.rejected, (state, action) => {
        state.loadingTemplate = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveSlug, cacheTemplate, clearTemplateCache } =
  templateSlice.actions;

export default templateSlice.reducer;
