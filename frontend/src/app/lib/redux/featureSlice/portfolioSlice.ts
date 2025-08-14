import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PortfolioResponse, PortfolioStockInput } from "../../types";
import axios from "axios";
// import { RootState } from "../store";
// import { cookies } from "next/headers";
import { getCookie } from "cookies-next/client";
import {
  addPortfolio,
  deletePortfolio,
  fetchPortfolio,
  updatePortfolio,
} from "../services/portfolio";

interface PortfolioState {
  data: PortfolioResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  data: null,
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.error = action.error.message || "failed to fetch portfolio";
        state.loading = false;
      })
      .addCase(addPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPortfolio.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPortfolio.rejected, (state, action) => {
        state.error = action.error.message || "failed to save portfolio";
        state.loading = false;
      })
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.error = action.error.message || "failed to delete portfolio";
        state.loading = false;
      })
      .addCase(updatePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortfolio.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.error = action.error.message || "failed to update portfolio";
        state.loading = false;
      });
  },
});

export default portfolioSlice.reducer;
