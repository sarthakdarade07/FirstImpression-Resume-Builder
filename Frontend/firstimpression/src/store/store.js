// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authslice";
import metadataReducer from "../redux/slices/metadataSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    metadata: metadataReducer,
  },
});

export default store;