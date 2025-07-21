"use client";
import React from "react";

const PortfolioTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            {[
              "Stock name",
              "Buy",
              "Qty",
              "Invested",
              "%",
              "Ex",
              "CMP",
              "Value",
              "±",
              "P/E",
              "Earnings",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-slate-200 hover:bg-slate-50"
            >
              <td className="px-3 py-2">Example {index + 1}</td>
              <td className="px-3 py-2">Buy</td>
              <td className="px-3 py-2">100</td>
              <td className="px-3 py-2">$1000</td>
              <td className="px-3 py-2">10%</td>
              <td className="px-3 py-2">Ex</td>
              <td className="px-3 py-2">$150</td>
              <td className="px-3 py-2">$15000</td>
              <td className="px-3 py-2">+5%</td>
              <td className="px-3 py-2">20</td>
              <td className="px-3 py-2">$5000</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
