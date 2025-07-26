"use client";
import React from "react";

const SectorSummary = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Reliance Industries</h2>
        <div className="flex">
          {" "}
          <p className="text-2xl">$100,000</p> &nbsp;{" "}
          <p className="text-1xl text-green-600">+$20,000 (25%)</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">HDFC Bank</h2>
        <div className="flex">
          {" "}
          <p className="text-2xl">$500,000</p> &nbsp;{" "}
          <p className="text-1xl text-red-600">-$1,000 (5%)</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Wipro</h2>
        <div className="flex">
          {" "}
          <p className="text-2xl">$800,000</p> &nbsp;{" "}
          <p className="text-1xl text-green-600">+$20,000 (25%)</p>
        </div>
      </div>
    </div>
  );
};

export default SectorSummary;
