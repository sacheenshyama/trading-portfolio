import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchActivity = createAsyncThunk("/api/getActivity", async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getActivity`,
    {
      withCredentials: true,
    }
  );
  return res.data;
});

export const deleteActivity = createAsyncThunk(
  "/api/deleteActivity",
  async (id: string[], { dispatch }) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/deleteActivity`,
      {
        data: { logId: id },
        withCredentials: true,
      }
    );
    dispatch(fetchActivity());
    return res.data;
  }
);
