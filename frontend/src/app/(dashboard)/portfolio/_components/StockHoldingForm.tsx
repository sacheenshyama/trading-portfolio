"use client";
import SearchBox from "@/app/_components/SearchBox";
import { addPortfolio } from "@/app/lib/redux/featureSlice/portfolioSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Bounce, ToastContainer } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  stock: z.object({
    symbol: z.string().min(1),
    exchange: z.string().min(1),
    shortname: z.string().min(1),
  }),
  buyPrice: z.number().positive().max(9999),
  quantity: z.number().positive().max(99999),
});
const StockHoldingForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector((state) => state.portfolio.loading);

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

  const onSubmit = () => {
    dispatch(
      addPortfolio({
        symbol: stock.symbol,
        exchange: stock.exchange,
        name: stock.shortname,
        purchasePrice: buyPrice,
        quantity,
      })
    );
    reset();
    router.refresh();
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
            className="focus:outline-none text-white bg-black hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            {loading ? "Adding stock" : "Add stock"}
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
