import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../types";
import { googleSignInUser, otpSignIn, simpleSignIn } from "../services/authApi";
import { setCookie } from "cookies-next/client";

const initialState: AuthState = {
  jwtToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(googleSignInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignInUser.fulfilled, (state, action) => {
        setCookie("jwtToken", action.payload.jwtToken);
        state.jwtToken = action.payload.jwtToken;
        state.loading = false;
        window.location.reload();
      })
      .addCase(googleSignInUser.rejected, (state, action) => {
        state.error = action.error.message || "An unknown error occurred RDX";
        state.loading = false;
      })
      .addCase(simpleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simpleSignIn.fulfilled, (state, action) => {
        setCookie("jwtToken", action.payload.jwtToken);
        state.jwtToken = action.payload.jwtToken;
        state.loading = false;
        window.location.reload();
      })
      .addCase(simpleSignIn.rejected, (state, action) => {
        state.error = action.error.message || "An unknown error occurred RDX";
        state.loading = false;
      })
      .addCase(otpSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpSignIn.fulfilled, (state, action) => {
        setCookie("jwtToken", action.payload.jwtToken);
        state.jwtToken = action.payload.jwtToken;
        state.loading = false;
        // window.location.reload();
      })
      .addCase(otpSignIn.rejected, (state, action) => {
        state.error = action.error.message || "An unknown error occurred RDX";
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
