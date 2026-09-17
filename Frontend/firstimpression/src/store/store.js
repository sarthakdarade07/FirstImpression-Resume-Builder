// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authslice";
import metadataReducer from "../redux/slices/metadataSlice";
import jdReducer from "../redux/slices/jdSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    metadata: metadataReducer,
    jd: jdReducer,
  },
});

export default store;