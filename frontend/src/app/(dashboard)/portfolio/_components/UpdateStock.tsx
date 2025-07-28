import SearchBox from "@/app/_components/SearchBox";
import { updatePortfolio } from "@/app/lib/redux/featureSlice/portfolioSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { PortfolioStockInput } from "@/app/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseSharp } from "react-icons/io5";
import { Bounce, ToastContainer } from "react-toastify";
import z from "zod";

const schema = z.object({
  stock: z.object({
    symbol: z.string().min(1),
    exchange: z.string().min(1),
    shortname: z.string().min(1),
  }),
  buyPrice: z.number().positive(),
  quantity: z.number().positive(),
});
interface updateProp {
  isOpen: boolean;
  onClose: () => void;
  stockUpdate: PortfolioStockInput | null;
}
const UpdateStock: React.FC<updateProp> = ({
  isOpen,
  onClose,
  stockUpdate,
}) => {
  // console.log("stockupdate", stockUpdate);
  const loading = useAppSelector((state) => state.portfolio.loading);
  const dispatch = useAppDispatch();

  const [selectedStock, setSelectedStock] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  useEffect(() => {
    if (stockUpdate) {
      reset({
        stock: {
          symbol: stockUpdate.symbol,
          exchange: stockUpdate.exchange,
          shortname: stockUpdate.name,
        },
        buyPrice: stockUpdate.purchasePrice,
        quantity: stockUpdate.quantity,
      });

      setSelectedStock(
        stockUpdate
          ? `${stockUpdate.symbol},${stockUpdate.exchange},${stockUpdate.name}`
          : ""
      );
    }
  }, [stockUpdate, reset]);
  const { buyPrice, quantity, stock } = watch();
  const total = buyPrice && quantity ? buyPrice * quantity : 0;

  const onSubmit = () => {
    const id = stockUpdate?.id;
    dispatch(
      updatePortfolio({
        symbol: stock.symbol,
        exchange: stock.exchange,
        name: stock.shortname,
        purchasePrice: buyPrice,
        quantity,
        id,
      })
    );
    setTimeout(() => {
      onClose();
    }, 300);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-[#0000007d]">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative  bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Stock
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              onClick={onClose}
            >
              <IoCloseSharp />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  {selectedStock && (
                    <SearchBox
                      setValue={setValue}
                      defaultStock={selectedStock || ""}
                    />
                  )}

                  {errors.stock && (
                    <p className="text-red-500">Please pick a stock</p>
                  )}
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
                    {loading ? "Saving changes..." : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Modal footer */}
          <div className="flex justify-end p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
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
  );
};

export default UpdateStock;
