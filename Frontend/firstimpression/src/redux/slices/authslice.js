// src/redux/slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunks/auththunk";
import { getValidToken } from "../../util/auth";

let storedUser = null;
const token = getValidToken();
if (token) {
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) storedUser = JSON.parse(rawUser);
  } catch (e) { 
    storedUser = null;
  }
}

const initialState = {
  token: localStorage.getItem("jwtToken"),
  user: storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (action.payload.token) {
        localStorage.setItem("jwtToken", action.payload.token);
      } else {
        localStorage.removeItem("jwtToken");
      }
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem("user");
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (action.payload.token) {
        localStorage.setItem("jwtToken", action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    });
  },
});

export const { logout, setUser, setCredentials } = authSlice.actions;

export default authSlice.reducer;

