const yahooFinance = require("yahoo-finance2").default;
const express = require("express");

const stockSearch = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const result = await yahooFinance.quote(query);
    if (!result || !result.symbol) {
      return res.status(404).json({ error: "Stock not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching stock data" });
  }
};

module.exports = {
  stockSearch,
};
