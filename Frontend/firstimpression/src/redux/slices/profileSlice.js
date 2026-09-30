import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile } from "../thunks/profileThunks";
import { logout } from "./authslice";

const initialState = {
  profile: null,
  isLoaded: false,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.isLoaded = true;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout, () => initialState);
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
