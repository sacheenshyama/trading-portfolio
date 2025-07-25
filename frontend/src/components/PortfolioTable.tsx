"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp, FaFilePen } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";

const PortfolioTable = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  useEffect(() => {
    const fetchPortfolioData = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getPortfolio`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setPortfolioData(res.data.portfolio);
        console.log("Portfolio data:", res.data.portfolio);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };
    fetchPortfolioData();
  }, []);
  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
          {portfolioData &&
            portfolioData.map((item) => (
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
                <td className="px-3 py-2">₹{item.buyPrice}</td>
                <td className="px-3 py-2">{item.quantity}</td>
                <td className="px-3 py-2">₹{item.invested}</td>
                <td className="px-3 py-2">
                  {item.portfolioPercentage.toFixed(2)}%
                </td>
                <td className="px-3 py-2">{item.exchange}</td>
                <td className="px-3 py-2">₹{item.cmp}</td>
                <td className="px-3 py-2">₹{item.presentValue}</td>
                <td className="px-3 py-2">{item.peRatio}</td>
                <td
                  className={`px-3 py-2 flex ${
                    item.gainLoss < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.gainLoss < 0 ? (
                    <FaArrowTrendDown />
                  ) : (
                    <FaArrowTrendUp />
                  )}{" "}
                  &nbsp; ₹{item.gainLoss}
                  {`(${item.gainLossPercent}%)`}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 me-2  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    <FaFilePen />
                  </button>

                  <button
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
    </div>
  );
};

export default PortfolioTable;
