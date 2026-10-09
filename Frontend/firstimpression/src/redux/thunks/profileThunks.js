import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/axios";

/**
 * Fetch current user profile.
 * Caches in Redux: skips network request if profile is already loaded in Redux unless forceRefresh is true.
 */
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/profile/get-profile");

      return response.data?.message || response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch profile"
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg?.forceRefresh) return true;
      const { profile } = getState();
      // In-flight guard: don't send duplicate request if already loading
      if (profile?.loading) return false;
      if (profile?.isLoaded && profile?.profile) {
        return false; // Already cached in Redux - skip network call!
      }
      return true;
    },
  }
);
