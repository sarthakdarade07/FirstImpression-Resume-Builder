import { createAsyncThunk } from "@reduxjs/toolkit";
import { resumeApi } from "../../services/resumeApi";

/**
 * Fetch all resumes of the current user.
 * Caches in Redux: skips network request if userResumes is already loaded, unless forceRefresh is passed.
 */
export const fetchUserResumes = createAsyncThunk(
  "resume/fetchUserResumes",
  async (_, { rejectWithValue }) => {
    try {
      const resumes = await resumeApi.getUserResumes();
      return resumes || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resumes");
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg?.forceRefresh) return true;
      const { resume } = getState();
      if (resume?.loadingList) return false;
      if (resume?.isLoaded) {
        return false; // Skip network call - already cached
      }
      return true;
    },
  }
);

/**
 * Fetch a single resume by ID and load into active editor state
 */
export const fetchResumeById = createAsyncThunk(
  "resume/fetchResumeById",
  async (id, { rejectWithValue }) => {
    try {
      const resume = await resumeApi.getResumeById(id);
      return resume;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resume");
    }
  }
);

/**
 * Create a new resume from template and automatically add to userResumes in Redux
 */
export const createResumeThunk = createAsyncThunk(
  "resume/createResume",
  async ({ template, customTitle, customResumeData, user }, { rejectWithValue }) => {
    try {
      const created = await resumeApi.createResumeFromTemplate(
        template,
        customTitle,
        customResumeData,
        user
      );
      return created;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create resume");
    }
  }
);

/**
 * Update a resume and synchronize in Redux without re-fetching entire list
 */
export const updateResumeThunk = createAsyncThunk(
  "resume/updateResume",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updated = await resumeApi.updateResume(id, updates);
      return { id, updated: updated || updates };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update resume");
    }
  }
);

/**
 * Delete a resume on backend and instantly remove from Redux state without re-fetching
 */
export const deleteResumeThunk = createAsyncThunk(
  "resume/deleteResume",
  async (id, { rejectWithValue }) => {
    try {
      await resumeApi.deleteResume(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete resume");
    }
  }
);
