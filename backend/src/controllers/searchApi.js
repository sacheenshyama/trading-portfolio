const axios = require("axios");

const searchStock = async (req, res) => {
  //   console.log(req.query);
  try {
    const { q } = req.query;
    // console.log(q, "query");
    if (!q) {
      return res.status(401).json({ error: "Query parameter is required" });
    }
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${q}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    // console.error("yahoo error", error.message);
    res.status(500).json({
      error: error.message || "An error occurred while fetching stock data",
    });
  }
};

module.exports = {
  searchStock,
};
