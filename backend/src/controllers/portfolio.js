const yahooFinance = require("yahoo-finance2").default;
const { redisClient } = require("../config/redis");
const stockPortfolio = require("../models/portfolioStock");
const ActivityLog = require("../models/ActivityLog");
const createPortfolio = async (req, res) => {
  const { symbol, name, quantity, purchasePrice, exchange } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    if (!symbol || !name || !quantity || !purchasePrice || !exchange) {
      return res.status(400).json({ message: "please provide details" });
    }
    const newStock = await stockPortfolio.create({
      symbol,
      name,
      quantity,
      purchasePrice,
      exchange,
      owner: req.user._id,
    });

    await ActivityLog.create({
      stockId: newStock._id,
      owner: req.user._id,
      symbol,
      name,
      quantity,
      purchasePrice,
      action: "CREATED",
      message: "Stock added to portfolio",
    });

    const cacheKeyPortfolio = `portfolio:${req.user._id.toString()}`;
    const cacheKeyActivityLog = `activityLog:${req.user._id.toString()}`;
    await redisClient.del(cacheKeyActivityLog);
    await redisClient.del(cacheKeyPortfolio);

    res.status(201).json({ message: "Portfolio created successfully" });
  } catch (error) {
    res.status(400).json({
      error: error.message || "An error occurred while creating portfolio",
    });
  }
};

const getPortfolio = async (req, res) => {
  const userId = req.user._id;
  const cacheKey = `portfolio:${userId}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const portfolioStock = await stockPortfolio
      .find({
        owner: userId,
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
            purchasePrice: stock.purchasePrice,
            quantity: stock.quantity,
            invested: invested,
            cmp: cmp,
            id: stock._id,
            presentValue: currentValue.toFixed(2),
            gainLoss: gainLoss.toFixed(2),
            gainLossPercent: gainLossPercent.toFixed(2),
            peRatio: quote.trailingPE || quote.forwardPE || "N/A",
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
    const result = { summary, portfolio: holdingsWithPercent };

    await redisClient.set(cacheKey, JSON.stringify(result), "EX", 5 * 60);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while fetching portfolio",
    });
  }
};

const deletePortfolio = async (req, res) => {
  const _id = req.params.id;
  const owner = req.user._id;
  if (!_id || !owner) {
    return res.status(404).json({ message: "portfolio or user not found" });
  }
  try {
    const deleted = await stockPortfolio.findOneAndDelete({
      _id: _id,
      owner: owner,
    });
    if (!deleted) return res.status(403).json({ error: "Stock not found" });

    await ActivityLog.create({
      stockId: deleted._id,
      owner: owner,
      name: deleted.name,
      symbol: deleted.symbol,
      quantity: deleted.quantity,
      purchasePrice: deleted.purchasePrice,
      action: "DELETED",
      message: "Stock deleted from portfolio",
    });

    await redisClient.del(`activityLog:${owner.toString()}`);
    await redisClient.del(`portfolio:${owner.toString()}`);
    res.status(200).json({ message: "stock deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  const owner = req.user._id;
  const _id = req.params.id;
  if (!owner || !_id) {
    return res.status(404).json({ message: "Portfolio or user not found" });
  }
  try {
    const { symbol, name, quantity, purchasePrice, exchange } = req.body;
    const stock = await stockPortfolio
      .findOne({
        _id,
        owner,
      })
      .lean();

    const updated = await stockPortfolio.findOneAndUpdate(
      {
        _id,
        owner,
      },
      {
        symbol,
        name,
        quantity,
        purchasePrice,
        exchange,
      }
    );
    if (!updated) {
      return res.status(403).json({ message: "Stock not found" });
    }

    let message = "";
    if (symbol !== stock.symbol) message += `Symbol changed & `;
    if (quantity !== stock.quantity) message += `Quantiry changed & `;
    if (purchasePrice !== stock.purchasePrice)
      message += `Purchase Price changed`;

    await ActivityLog.create({
      stockId: updated._id,
      owner: owner,
      symbol,
      purchasePrice,
      quantity,
      name,
      action: "UPDATED",
      message: message.trim(),
    });
    await redisClient.del(`portfolio:${owner.toString()}`);
    await redisClient.del(`activityLog:${owner.toString()}`);
    res.status(200).json({ message: "stock updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createPortfolio,
  getPortfolio,
  deletePortfolio,
  updatePortfolio,
};
