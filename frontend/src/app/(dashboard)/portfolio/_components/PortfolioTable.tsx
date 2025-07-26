"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp, FaFilePen } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Bounce, toast, ToastContainer } from "react-toastify";
import UpdateStock from "./UpdateStock";

const PortfolioTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolioData, setPortfolioData] = useState([]);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setIsUpdateModalOpen(true);
  };
  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStock(null);
  };
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
      } catch (error) {
        setPortfolioData([]);
        console.error("Error fetching portfolio data:", error);
      }
    };
    fetchPortfolioData();
  }, []);

  const handleDelete = async (id) => {
    console.log("id selected", id);
    setLoading(true);
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deletePortfolio/${id}`,
        {
          headers: {
            Authorization: `${jwtToken}`,
          },
        }
      );
    } catch (error) {
      console.log({
        error: error.message || "Failed to delete",
      });
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
      <UpdateStock
        isOpen={isUpdateModalOpen}
        onClose={closeModal}
        stockUpdate={selectedStock}
      />
    </div>
  );
};

export default PortfolioTable;
