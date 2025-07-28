import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types";

const initialState: AuthState = {
  jwtToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.jwtToken = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.jwtToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.jwtToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout } =
  authSlice.actions;
export default authSlice.reducer;
