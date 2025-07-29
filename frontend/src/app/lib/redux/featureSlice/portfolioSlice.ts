import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PortfolioResponse, PortfolioStockInput } from "../../types";
import axios from "axios";
import { RootState } from "../store";

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
// fetch api call
export const fetchPortfolio = createAsyncThunk<PortfolioResponse>(
  "/api/getPortfolio",
  async (_, { getState }) => {
    const { auth } = getState() as RootState;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getPortfolio`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.jwtToken}`,
        },
      }
    );
    return res.data;
  }
);
export const addPortfolio = createAsyncThunk(
  "/api/createPortfolio",
  async (formdata: PortfolioStockInput, { getState, dispatch }) => {
    const { auth } = getState() as RootState;
    if (!auth.jwtToken) return "Login to see data";
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/createPortfolio`,
      {
        symbol: formdata.symbol,
        name: formdata.name,
        exchange: formdata.exchange,
        quantity: formdata.quantity,
        purchasePrice: formdata.purchasePrice,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.jwtToken}`,
        },
      }
    );
    dispatch(fetchPortfolio());
    return res.data;
  }
);

export const deletePortfolio = createAsyncThunk(
  "/api/deletePortfolio",

  async (id: string, { getState, dispatch }) => {
    const { auth } = getState() as RootState;
    if (!auth.jwtToken) return "Login to see data";
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/deletePortfolio/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `${auth.jwtToken}`,
        },
      }
    );
    dispatch(fetchPortfolio());
  }
);
export const updatePortfolio = createAsyncThunk(
  "/api/updatePortfolio/:id",
  async (formData: PortfolioStockInput, { getState, dispatch }) => {
    const { auth } = getState() as RootState;
    // console.log("updatestock...", formData);
    if (!auth.jwtToken) return "Login to see data";
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/updatePortfolio/${formData.id}`,
      {
        symbol: formData.symbol,
        name: formData.name,
        exchange: formData.exchange,
        quantity: formData.quantity,
        purchasePrice: formData.purchasePrice,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.jwtToken}`,
        },
      }
    );
    dispatch(fetchPortfolio());
  }
);

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
