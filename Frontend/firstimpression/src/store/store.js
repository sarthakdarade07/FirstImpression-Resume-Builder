// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authslice";
import metadataReducer from "../redux/slices/metadataSlice";
import jdReducer from "../redux/slices/jdSlice";
import resumeReducer from "../redux/slices/resumeSlice";
import templateReducer from "../redux/slices/templateSlice";
import profileReducer from "../redux/slices/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    metadata: metadataReducer,
    jd: jdReducer,
    resume: resumeReducer,
    template: templateReducer,
    profile: profileReducer,
  },
});

export default store;