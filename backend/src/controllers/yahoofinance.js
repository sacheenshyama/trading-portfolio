const yahooFinance = require("yahoo-finance2").default;

const stock = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    // const result = await yahooFinance.search(q);
    const result = await yahooFinance.quote(q);

    return res.status(200).json(result);
    // if (!result || !result.symbol) {
    //   return res.status(404).json({ error: "Stock not found" });
    // }
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message || "An error occurred while fetching stock data",
      });
  }
};

module.exports = {
  stock,
};
