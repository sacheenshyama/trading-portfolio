const yahooFinance = require("yahoo-finance2").default;
const stockPortfolio = require("../models/portfolioStock");
const createPortfolio = async (req, res) => {
  const { symbol, name, quantity, purchasePrice, exchange } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    if (!symbol || !name || !quantity || !purchasePrice || !exchange) {
      return res.status(400).json({ message: "please provide details" });
    }
    await stockPortfolio.create({
      symbol,
      name,
      quantity,
      purchasePrice,
      exchange,
      owner: req.user._id,
    });
    res.status(201).json({ message: "Portfolio createed successfully" });
  } catch (error) {
    res.status(400).json({
      error: error.message || "An error occurred while creating portfolio",
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const portfolioStock = await stockPortfolio
      .find({
        owner: req.user._id,
      })
      .lean();
    if (portfolioStock.length === 0) {
      return res.status(404).json({ message: "No portfolio found" });
    }

    let portfolioResult = [];
    let totalInvested = 0;
    let totalCurrentValue = 0;

    await Promise.all(
      portfolioStock.map(async (stock) => {
        try {
          let quote = await yahooFinance.quote(stock.symbol);

          const cmp = quote.regularMarketPrice || 0;
          const invested = stock.quantity * stock.purchasePrice;
          const currentValue = stock.quantity * cmp;
          const gainLoss = currentValue - invested;
          const gainLossPercent = (gainLoss / invested) * 100;

          portfolioResult.push({
            symbol: stock.symbol,
            name: stock.name,
            exchange: stock.exchange,
            buyPrice: stock.purchasePrice,
            quantity: stock.quantity,
            invested,
            cmp,
            id: stock._id,
            presentValue: currentValue.toFixed(2),
            gainLoss: gainLoss.toFixed(2),
            gainLossPercent: gainLossPercent.toFixed(2),
            peRatio:
              quote.trailingPE.toFixed(2) ||
              quote.forwardPE.toFixed(2) ||
              "N/A",
            latestEarningsTimestamp: quote.earningsTimestamp
              ? new Date(quote.earningsTimestamp * 1000).toLocaleDateString()
              : "N/A",
          });
          totalInvested += invested;
          totalCurrentValue += currentValue;
        } catch (error) {
          console.error("Error fetching stock data:", error);
          portfolioResult.push({
            ...stock,
            error: "Error fetching stock data",
          });
        }
      })
    );
    const holdingsWithPercent = portfolioResult.map((item) => ({
      ...item,
      portfolioPercentage:
        totalCurrentValue > 0
          ? (item.presentValue / totalCurrentValue) * 100
          : 0,
    }));

    const summary = {
      totalInvested: totalInvested.toFixed(2),
      totalCurrentValue: totalCurrentValue.toFixed(2),
      totalGainLoss: totalCurrentValue - totalInvested,
      totalGainLossPercent:
        totalInvested > 0
          ? (
              ((totalCurrentValue - totalInvested) / totalInvested) *
              100
            ).toFixed(2)
          : 0,
      stocksCount: portfolioStock.length,
    };
    res.status(200).json({
      summary,
      portfolio: holdingsWithPercent,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while fetching portfolio",
    });
  }
};

const deletePortfolio = async (req, res) => {
  const _id = req.query.id;
  const owner = req.user._id;
  if (!_id || !owner) {
    return res.status(404).json({ message: "portfolio or user not found" });
  }
  try {
    const holding = await stockPortfolio.findOneAndDelete({
      _id: _id,
      owner: owner,
    });
    if (!holding) return res.status(403).json({ error: "Stock not found" });
    res.status(200).json({ message: "stock deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePortfolio = async (req, res) => {};
module.exports = {
  createPortfolio,
  getPortfolio,
  deletePortfolio,
  updatePortfolio,
};
