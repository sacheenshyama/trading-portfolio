"use client";
import SearchBox from "@/components/SearchBox";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useGetCookie, useGetCookies } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  stock: z.object({
    symbol: z.string().min(1),
    exchange: z.string().min(1),
    shortname: z.string().min(1),
  }),
  buyPrice: z.number().positive(),
  quantity: z.number().positive(),
});
const StockHoldingForm = () => {
  const router = useRouter();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const getCookie = useGetCookie();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { buyPrice, quantity, stock } = watch();

  const total = buyPrice && quantity ? buyPrice * quantity : 0;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // const jwtToken = localStorage.getItem("jwtToken");
    const jwtToken = getCookie("jwtToken");
    
    if (!jwtToken) {
      toast.warn("Please Login", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setLoading(false);
      setTimeout(() => {
        router.push("/sign-in");
      }, 500);

      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/createPortfolio`,
        {
          symbol: stock.symbol,
          name: stock.shortname,
          exchange: stock.exchange,
          quantity: quantity,
          purchasePrice: buyPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      reset();
    } catch (error) {
      setError(error);
      toast.error(`${error.response?.data?.msg} || 'Failed to add'`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);

      toast.success("🦄 Wow so easy!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <SearchBox setValue={setValue} />
          {errors.stock && <p className="text-red-500">Please pick a stock</p>}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <input
            {...register("buyPrice", { valueAsNumber: true })}
            className="appearance-none block w-full border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="number-second"
            type="number"
            required
            placeholder="Buy Price"
            disabled={loading}
          />
          {errors.buyPrice && (
            <p className="text-red-500">{errors.buyPrice.message}</p>
          )}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <input
            {...register("quantity", { valueAsNumber: true })}
            className="appearance-none block w-full border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="number-first"
            type="number"
            required
            placeholder="Quantity"
            disabled={loading}
          />
          {errors.quantity && (
            <p className="text-red-500">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <input
            className="appearance-none block w-full  border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-middle-name"
            type="text"
            placeholder="Total investment"
            value={total ? `₹ ${total.toFixed(2)}` : ""}
            readOnly
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <button
            disabled={loading}
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {loading ? "Adding stock…" : "Add stock"}
          </button>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
        </div>
      </div>
    </form>
  );
};

export default StockHoldingForm;
