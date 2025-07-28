import React from "react";
import StockChart from "./_components/StockChart";
import Navbar from "@/app/_components/Navbar";

const Page = () => {
  return (
    <div className="">
      <Navbar />
      <hr className="text-gray-200  w-[100vw] mb-4" />
      <div className="flex justify-center">
        <StockChart />
      </div>
    </div>
  );
};

export default Page;
