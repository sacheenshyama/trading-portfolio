"use client";
import PortfolioTable from "@/components/PortfolioTable";
import SearchBox from "@/components/SearchBox";
import SectorSummary from "@/components/SectorSummary";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [stockData, setStockData] = useState(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submitted");
    // Handle form submission logic here
  };
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-wxl font-bold mb-4">Portfolio Dashboard</h1>
      {/* search box with form */}
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <SearchBox setStockData={setStockData} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <input
              className="appearance-none block w-full border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Buy Price"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <input
              className="appearance-none block w-full border border-gray-200 rounded py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Quantity"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <input
              className="appearance-none block w-full  border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Total investment"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <button
              type="submit"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Green
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6">
        <PortfolioTable />
      </div>
    </main>
  );
}
