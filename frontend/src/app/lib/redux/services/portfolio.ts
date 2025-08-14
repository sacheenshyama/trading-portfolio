import { createAsyncThunk } from "@reduxjs/toolkit";
import { PortfolioResponse, PortfolioStockInput } from "../../types";
import axios from "axios";
import { getCookie } from "cookies-next";

export const fetchPortfolio = createAsyncThunk<PortfolioResponse>(
  "/api/getPortfolio",
  async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getPortfolio`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const addPortfolio = createAsyncThunk(
  "/api/createPortfolio",
  async (formdata: PortfolioStockInput, { dispatch }) => {
    const jwtToken = getCookie("jwtToken");
    if (!jwtToken) return "Login to see data";
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
      }
    );
    dispatch(fetchPortfolio());
    return res.data;
  }
);

export const deletePortfolio = createAsyncThunk(
  "/api/deletePortfolio",

  async (id: string, { dispatch }) => {
    const jwtToken = getCookie("jwtToken");
    if (!jwtToken) return "Login to see data";
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/deletePortfolio/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(fetchPortfolio());
  }
);
export const updatePortfolio = createAsyncThunk(
  "/api/updatePortfolio/:id",
  async (formData: PortfolioStockInput, { dispatch }) => {
    const jwtToken = getCookie("jwtToken");
    if (!jwtToken) return "Login to see data";
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
      }
    );
    dispatch(fetchPortfolio());
  }
);
