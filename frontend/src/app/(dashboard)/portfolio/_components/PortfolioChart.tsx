import { PortfolioStock } from "@/app/lib/types";
import React from "react";
import Chart from "react-google-charts";

interface portfolioChartProp {
  portfolioData: PortfolioStock[];
}
const PortfolioChart: React.FC<portfolioChartProp> = ({ portfolioData }) => {
  // console.log("portfoliodata charty", portfolioData);
  const newdata = portfolioData;
  const data =
    newdata &&
    newdata.map((item) => {
      return [item.symbol, item.portfolioPercentage];
    });
  data.unshift(["Symbol", "Total Investment"]);
  const options = {
    title: "Portfolio Distribution by Company",
    pieHole: 0.4,
    is3D: true,
   
    pieStartAngle: 100,
    // sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    colors: [
      "#8AD1C2",
      "#9F8AD1",
      "#D18A99",
      "#BCD18A",
      "#D1C28A",
      "#8AB6D1",
      "#D18AC4",
      "#A1D18A",
      "#D1A88A",
      "#C08AD1",
    ],
  };
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
};

export default PortfolioChart;
