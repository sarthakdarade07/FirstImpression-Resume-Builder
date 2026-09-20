// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authslice";
import metadataReducer from "../redux/slices/metadataSlice";
import jdReducer from "../redux/slices/jdSlice";
import resumeReducer from "../redux/slices/resumeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    metadata: metadataReducer,
    jd: jdReducer,
    resume: resumeReducer,
  },
});

export default store;