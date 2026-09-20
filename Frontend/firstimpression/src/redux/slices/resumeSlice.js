import { createSlice } from "@reduxjs/toolkit";
import { mergeResumeData } from "../../utils/resumeMerger";

const initialState = {
  currentResume: null,  // Single source of truth for active resume data
  savedResume: null,    // Last saved state from DB
  resumeId: null,
  resumeTitle: "",
  templateSlug: "modern-sidebar",
  lastSavedAt: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    updateCurrentResume: (state, action) => {
      if (!state.currentResume) {
        state.currentResume = action.payload;
      } else {
        state.currentResume = {
          ...state.currentResume,
          ...action.payload,
        };
      }
    },
    mergeAlteredResume: (state, action) => {
      if (action.payload) {
        state.currentResume = mergeResumeData(state.currentResume, action.payload);
      }
    },
    setSavedResume: (state, action) => {
      state.savedResume = action.payload;
      state.lastSavedAt = new Date().toISOString();
    },
    setResumeMetadata: (state, action) => {
      const { resumeId, resumeTitle, templateSlug } = action.payload || {};
      if (resumeId !== undefined) state.resumeId = resumeId;
      if (resumeTitle !== undefined) state.resumeTitle = resumeTitle;
      if (templateSlug !== undefined) state.templateSlug = templateSlug;
    },
    setTemplateSlug: (state, action) => {
      state.templateSlug = action.payload;
    },
    setResumeTitle: (state, action) => {
      state.resumeTitle = action.payload;
    },
    resetResume: (state) => {
      state.currentResume = null;
      state.savedResume = null;
      state.resumeId = null;
      state.resumeTitle = "";
      state.templateSlug = "modern-sidebar";
      state.lastSavedAt = null;
    },
  },
});

export const {
  setCurrentResume,
  updateCurrentResume,
  mergeAlteredResume,
  setSavedResume,
  setResumeMetadata,
  setTemplateSlug,
  setResumeTitle,
  resetResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
