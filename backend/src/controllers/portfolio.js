const yahooFinance = require("yahoo-finance2").default;
const StockPortfolio = require("../models/portfolioStock");
const createPortfolio = async (req, res) => {
  const { symbol, name, quantity, purchasePrice, exchange } = req.body;

  try {
    if (!symbol || !name || !quantity || !purchasePrice || !exchange) {
      return res.status(400).json({ message: "please provide details" });
    }
    const portfolioData = await StockPortfolio.create({
      symbol,
      name,
      quantity,
      purchasePrice,
      exchange,
    });
    res.status(201).json({ message: "Portfolio createed successfully" });
  } catch (error) {
    res.status(400).json({
      error: error.message || "An error occurred while creating portfolio",
    });
  }
};

const getPortfolio=async(req,res)=>{

}

module.exports = {
  createPortfolio,
};
