import { createSlice } from "@reduxjs/toolkit";
import { ActivityLog } from "./../../types";
import { deleteActivity, fetchActivity } from "../services/activityApi";

interface ActivityState {
  data: ActivityLog[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  data: null,
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch activity RDX";
        state.loading = false;
      })
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete logs RDX";
        state.loading = false;
      });
  },
});

export default activitySlice.reducer;
