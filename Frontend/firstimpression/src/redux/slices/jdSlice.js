import { createSlice } from "@reduxjs/toolkit";
import { uploadJd, fetchJdByResumeId } from "../thunks/jdThunk";

const initialState = {
  jd: null,
  loading: false,
  fetching: false,
  error: null,
};

const jdSlice = createSlice({
  name: "jd",
  initialState,

  reducers: {
    clearJd: (state) => {
      state.jd = null;
      state.error = null;
    },

    clearJdError: (state) => {
      state.error = null;
    },
  },

   extraReducers:(builder)=>{
     builder
        // =========================
      // UPLOAD JD - PENDING
      // =========================

      .addCase(uploadJd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

        // =========================
      // UPLOAD JD - SUCCESS
      // =========================
      .addCase(uploadJd.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.jd = action.payload;
      })

      // =========================
      // UPLOAD JD - FAILED
      // =========================
      .addCase(uploadJd.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to upload JD";
      })

      // =========================
      // FETCH JD - PENDING
      // =========================
      .addCase(fetchJdByResumeId.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })

      // =========================
      // FETCH JD - SUCCESS
      // =========================
      .addCase(fetchJdByResumeId.fulfilled, (state, action) => {
        state.fetching = false;
        state.error = null;
        state.jd = action.payload || null;
      })

      // =========================
      // FETCH JD - FAILED
      // =========================
      .addCase(fetchJdByResumeId.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload || "Failed to fetch JD";
      });
   }
});


export const {
    clearJd,
    clearJdError
} = jdSlice.actions;

export default jdSlice.reducer;