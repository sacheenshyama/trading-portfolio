const yahooFinance = require("yahoo-finance2").default;


const getLiveStock = async (req, res) => {
  const { symbol, range } = req.query;
  if (!symbol) {
    return res.status(401).json({ message: "enter symbol" });
  }
  try {
    const historicalData = await yahooFinance._chart(symbol, {
      period1: new Date().toISOString().split("T")[0],
      range: range,
    });

    const chartData = formatForGoogleCharts(historicalData.quotes);
    const meta = historicalData.meta;
    const event = historicalData?.events;
    res.status(200).json({ meta, event, chartData });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to load stock Data" });
  }
};

function formatForGoogleCharts(data) {
  return [
    ["Date", "Open", "High", "Low", "Close"], // Header row
    ...data.map((item) => [
      item.date.toISOString().split("T")[0], // Date (YYYY-MM-DD)
      item.open,
      item.high,
      item.low,
      item.close,
    ]),
  ];
}
module.exports = {
  getLiveStock,
};
