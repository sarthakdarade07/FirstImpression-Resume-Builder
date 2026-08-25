import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchEducationMetadata = createAsyncThunk(
  'metadata/fetchEducationMetadata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/profile/education-metadata');
      return response.data;
    } catch (err) {
      // Fallback: try individual endpoints
      try {
        const [eduRes, scoreRes] = await Promise.all([
          api.get('/api/profile/education-types'),
          api.get('/api/profile/score-types'),
        ]);
        return {
          educationTypes: eduRes.data,
          scoreTypes: scoreRes.data,
        };
      } catch (innerErr) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  }
);

const initialState = {
  educationTypes: [
    // { id: 1, title: "10th Standard / SSC" },
    // { id: 2, title: "12th Standard / HSC" },
    // { id: 3, title: "Diploma" },
    // { id: 4, title: "Bachelor's Degree (B.E / B.Tech / B.Sc / BCA / B.Com / B.A)" },
    // { id: 5, title: "Master's Degree (M.E / M.Tech / M.Sc / MCA / MBA / M.A)" },
    // { id: 6, title: "Doctorate / Ph.D." },
    // { id: 7, title: "Other / Certification Course" },
  ],
  scoreTypes: [
    // { id: 1, title: "CGPA" },
    // { id: 2, title: "Percentage (%)" },
    // { id: 3, title: "GPA (out of 4.0)" },
    // { id: 4, title: "Grade / Marks" },
  ],
  loading: false,
  error: null,
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setEducationTypes: (state, action) => {
      state.educationTypes = action.payload;
    },
    setScoreTypes: (state, action) => {
      state.scoreTypes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationMetadata.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.educationTypes && action.payload.educationTypes.length > 0) {
          state.educationTypes = action.payload.educationTypes;
        }
        if (action.payload?.scoreTypes && action.payload.scoreTypes.length > 0) {
          state.scoreTypes = action.payload.scoreTypes;
        }
      })
      .addCase(fetchEducationMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEducationTypes, setScoreTypes } = metadataSlice.actions;
export default metadataSlice.reducer;