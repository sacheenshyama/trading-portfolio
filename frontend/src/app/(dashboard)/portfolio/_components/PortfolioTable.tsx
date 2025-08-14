"use client";
import React, { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp, FaFilePen } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Bounce, ToastContainer } from "react-toastify";
import UpdateStock from "./UpdateStock";
import PortfolioChart from "./PortfolioChart";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";

import { PortfolioStockInput } from "@/app/lib/types";
import { Mosaic } from "react-loading-indicators";
import StockHoldingForm from "./StockHoldingForm";
import {
  deletePortfolio,
  fetchPortfolio,
} from "@/app/lib/redux/services/portfolio";

const PortfolioTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.portfolio.data);
  const error = useAppSelector((state) => state.portfolio.error);
  const loading = useAppSelector((state) => state.portfolio.loading);
  // const [portfolioData, setPortfolioData] = useState(data?.portfolio);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] =
    useState<PortfolioStockInput | null>(null);
  const handleEdit = (stock: PortfolioStockInput) => {
    setSelectedStock(stock);
    setIsUpdateModalOpen(true);
  };
  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStock(null);
  };

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    dispatch(deletePortfolio(id));
  };
  // if (!data) {
  //   return (
  //     <p className="text-2xl font-bold text-center">
  //       Add stock to see into your Portfolio
  //     </p>
  //   );
  // }
  // if (error) {
  //   return (
  //     <p className="text-2xl text-red-600 text-center">
  //       Error while loading table please clear your cache and hard reload
  //     </p>
  //   );
  // }
  return (
    <div className="max-h-full container">
      <h2 className="text-2xl font-bold mt-5 mb-2">My Portfolio</h2>
      <StockHoldingForm />
      {error && (
        <p className="text-2xl text-red-600 text-center">
          Error while loading table please clear your cache and hard reload
        </p>
      )}
      {loading ? (
        <span className="absolute left-5/12">
          <Mosaic color="#000" size="large" text="" textColor="" />{" "}
        </span>
      ) : (
        <div>
          <table className="w-full overflow-x-scroll text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs font-bold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {[
                  "Stock",
                  "Buy-Price",
                  "Qty",
                  "Invest",
                  "Portfolio %",
                  "Exch",
                  "CMP",
                  "Present Value",
                  "P/E",
                  "P&L",
                  "Action",
                ].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.portfolio &&
                data?.portfolio.map((item) => (
                  <tr
                    key={item.symbol}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.symbol}
                    </th>
                    <td className="px-3 py-2">₹{item.purchasePrice}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">₹{item.invested}</td>
                    <td className="px-3 py-2">
                      {item.portfolioPercentage.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2">{item.exchange}</td>
                    <td className="px-3 py-2">₹{item.cmp.toFixed(2)}</td>
                    <td className="px-3 py-2">₹{item.presentValue}</td>
                    <td className="px-3 py-2">{item.peRatio}</td>
                    <td
                      className={`px-3 py-2 flex ${
                        (item.gainLoss as number) < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {(item.gainLoss as number) < 0 ? (
                        <FaArrowTrendDown />
                      ) : (
                        <FaArrowTrendUp />
                      )}{" "}
                      &nbsp; ₹{item.gainLoss} <br />
                      {`(${item.gainLossPercent}%)`}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 me-2  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        <FaFilePen />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 me-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <PortfolioChart portfolioData={data?.portfolio ?? []} />
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
      )}

      <UpdateStock
        isOpen={isUpdateModalOpen}
        onClose={closeModal}
        stockUpdate={selectedStock}
      />
    </div>
  );
};

export default PortfolioTable;
