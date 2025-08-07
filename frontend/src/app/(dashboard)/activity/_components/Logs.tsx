"use client";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import {
  deleteActivity,
  fetchActivity,
} from "@/app/lib/redux/services/activityApi";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mosaic } from "react-loading-indicators";
const Logs = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.activity.data);
  const loading = useAppSelector((state) => state.activity.loading);
  const error = useAppSelector((state) => state.activity.error);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchActivity());
  }, [dispatch]);

  // console.log("Activity data", data);

  const handleDeleteSelected = () => {
    dispatch(deleteActivity(checked));
  };

  if (error) {
    return (
      <p className="text-2xl text-red-600 text-center">
        Error while loading Activity Log please clear your cache and hard reload
      </p>
    );
  }
  return (
    <div className="max-h-full container">
      <h2 className=" px-2 text-2xl font-bold mt-5 mb-2">Activity Log</h2>
      <button
        onClick={handleDeleteSelected}
        disabled={checked.length === 0}
        className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 mt-4 rounded-2xl inline-flex items-center"
      >
        <span>Delete Selected</span>
      </button>

      <div className="relative overflow-x-auto mt-4">
        {loading ? (
          <span className="absolute left-5/12">
            <Mosaic color="#000" size="large" text="" textColor="" />{" "}
          </span>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase  dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>

                <th scope="col" className="px-6 py-3">
                  Buy price
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Message
                </th>
                <th scope="col" className="px-6 py-3">
                  TimeStamp
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-gray-950 bg-gray-300"
                        onChange={() =>
                          setChecked((prev) => [...prev, item._id])
                        }
                      />
                    </td>
                    <td className="px-6 py-4">{item.symbol}</td>
                    <td className="px-6 py-4">{item.name}</td>

                    <td className="px-6 py-4">${item.quantity}</td>
                    <td className="px-6 py-4">{item.purchasePrice}</td>
                    <td className="px-6 py-4">{item.action}</td>
                    <td className="px-6 py-4">{item.message}</td>
                    <td className="px-6 py-4">
                      {format(
                        new Date(item.createdAt),
                        "MMM d, yyyy, h:mm:ss a"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}{" "}
      </div>
    </div>
  );
};

export default Logs;
