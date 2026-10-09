import { createSlice } from "@reduxjs/toolkit";
import { mergeResumeData } from "../../utils/resumeMerger";
import {
  fetchUserResumes,
  fetchResumeById,
  createResumeThunk,
  updateResumeThunk,
  deleteResumeThunk,
} from "../thunks/resumeThunks";
import { logout } from "./authslice";

const initialState = {
  userResumes: [],      // Cached list of all user resumes
  isLoaded: false,      // Tracks whether userResumes has been loaded from backend
  currentResume: null,  // Single source of truth for active resume data
  savedResume: null,    // Last saved state from DB
  resumeId: null,
  resumeTitle: "",
  templateSlug: "modern-sidebar",
  lastSavedAt: null,
  loadingList: false,
  loadingResume: false,
  isSaving: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setUserResumes: (state, action) => {
      state.userResumes = action.payload || [];
      state.isLoaded = true;
    },
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
  
  extraReducers: (builder) => {
    builder
      // =========================
      // FETCH USER RESUMES LIST
      // =========================
      .addCase(fetchUserResumes.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchUserResumes.fulfilled, (state, action) => {
        state.loadingList = false;
        state.isLoaded = true;
        state.userResumes = action.payload || [];
      })
      .addCase(fetchUserResumes.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      // =========================
      // FETCH RESUME BY ID
      // =========================
      .addCase(fetchResumeById.pending, (state) => {
        state.loadingResume = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loadingResume = false;
        if (action.payload) {
          const res = action.payload;
          state.resumeId = res.id;
          state.resumeTitle = res.title || state.resumeTitle;
          state.templateSlug = res.templateSlug || state.templateSlug;
          let parsedData = res.resumeDataJson;
          if (typeof parsedData === "string") {
            try {
              parsedData = JSON.parse(parsedData);
            } catch {}
          }
          if (parsedData) {
            state.currentResume = parsedData;
            state.savedResume = parsedData;
          }
        }
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loadingResume = false;
        state.error = action.payload;
      })

      // =========================
      // CREATE RESUME
      // =========================
      .addCase(createResumeThunk.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(createResumeThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        if (action.payload) {
          // Optimistically add to userResumes list without re-fetching API!
          state.userResumes = [action.payload, ...state.userResumes];
          state.resumeId = action.payload.id;
          state.resumeTitle = action.payload.title;
          state.templateSlug = action.payload.templateSlug;
        }
      })
      .addCase(createResumeThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      // =========================
      // UPDATE RESUME
      // =========================
      .addCase(updateResumeThunk.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateResumeThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        const { id, updated } = action.payload;
        state.userResumes = state.userResumes.map((r) =>
          String(r.id) === String(id) ? { ...r, ...updated } : r
        );
        state.lastSavedAt = new Date().toISOString();
      })
      .addCase(updateResumeThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      // =========================
      // DELETE RESUME
      // =========================
      .addCase(deleteResumeThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        // Instantly remove from Redux state without re-fetching /api/resumes!
        state.userResumes = state.userResumes.filter(
          (r) => String(r.id) !== String(deletedId)
        );
        if (String(state.resumeId) === String(deletedId)) {
          state.resumeId = null;
          state.currentResume = null;
          state.savedResume = null;
        }
      })

      // =========================
      // LOGOUT CLEANUP
      // =========================
      .addCase(logout, () => initialState);
  },
});

export const {
  setUserResumes,
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
