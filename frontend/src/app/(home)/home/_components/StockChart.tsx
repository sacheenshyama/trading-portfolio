"use client";
import SearchBox from "@/components/SearchBox";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";
import z from "zod";

type ChartStyle =
  | "LineChart"
  | "AreaChart"
  | "BarChart"
  | "ColumnChart"
  | "PieChart";
const schema = z.object({
  stock: z.object({
    symbol: z.string().min(1),
    exchange: z.string().min(1),
    shortname: z.string().min(1),
  }),
});
const StockChart = () => {
  const [meta, setMeta] = useState({ symbol: "", shortName: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartStyle, setChartStyle] = useState<ChartStyle>("AreaChart");
  const { handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(schema),
  });
  const [validInterval, setValidInterval] = useState("1mo");
  const { stock } = watch();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/liveStock?symbol=${stock.symbol}&range=${validInterval}`
      );
      setMeta(res.data.meta);
      setData(res.data.chartData);
      if (res.data.chartData.length <= 1) {
        toast.warn("This stock don't have data", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(`${error?.message} || 'Failed to add'`, {
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
  const options = {
    // title: `${meta.symbol}`,
    legend: "none",
    hAxis: { title: "Date", textPosition: "out" },
    vAxis: { title: "Price ($)" },
    chartArea: { width: "80%", height: "70%" },
    focusTarget: "category",
    crosshair: {
      trigger: "both",
      orientation: "vertical",
    },
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
      risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
    },
    tooltip: { isHtml: true },
    series: {
      0: { color: "#4f81bd", areaOpacity: 0.15 },
    },
  };
  const handleTimeStamp = (item) => {
    setValidInterval(item);
    setLoading(true);
    onSubmit();
  };
  return (
    <div className="max-h-full container">
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <h2 className="px-2 text-2xl font-bold mt-5 mb-2">
            Welcome to Algo&Stock
          </h2>
          <div className="flex ">
            <SearchBox setValue={setValue} />
            <button
              disabled={loading}
              type="submit"
              className="focus:outline-none h-fit text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 m-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <FaSearch />
            </button>{" "}
          </div>
        </form>
      </div>
      {data.length > 1 ? (
        <>
          <div className="border-b border-gray-300 mt-8">
            <h1 className="text-2xl font-semibold">{meta.shortName}</h1>
          </div>
          <div className="border-b border-gray-300 flex justify-between mt-2 gap-0.5">
            <div>
              {" "}
              {[
                "1d",
                "5d",
                "1mo",
                "3mo",
                "6mo",
                "1y",
                "2y",
                "5y",
                "10y",
                "ytd",
                "max",
              ].map((item, index) => (
                <button
                  onClick={() => handleTimeStamp(item)}
                  key={item}
                  disabled={loading}
                  className={`${
                    meta.range === item && "bg-blue-500 text-white"
                  } p-0.5 px-1 text-[11px] font-semibold rounded hover:text-blue-400`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div>
              <select
                id="countries"
                value={chartStyle}
                onChange={(e) => setChartStyle(e.target.value as ChartStyle)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a Chart Type</option>
                <option value="AreaChart">AreaChart</option>
                <option value="LineChart">LineChart</option>
                <option value="BarChart">BarChart</option>
                <option value="CandlestickChart">CandlestickChart</option>
              </select>
            </div>
          </div>

          <Chart
            chartType={chartStyle}
            width="100%"
            height={`${60}vh`}
            data={data}
            options={options}
          />
        </>
      ) : (
        <div className="">
          <Image
            src={"/assets/unnamed.png"}
            width={350}
            height={250}
            className="rounded-lg m-auto mt-8 w-[350] h-[200]"
            alt="Stock illustration"
          />
          <p className="font-bold text-center mt-5">
            Start Tracking Your Investments
          </p>
          <p className="text-sm text-center text-gray-500 w-sm mx-auto mt-1">
            Search for stocks to view detailed performance charts and analysis.
            Our app helps you monitor your investments and make informed
            decisions. Sign up to save your searches and receive personalized
            insights.
          </p>
        </div>
      )}
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

export default StockChart;
