const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stockPortfolio",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: String,
    name: String,
    quantity: Number,
    purchasePrice: Number,
    action: {
      type: String,
      enum: ["CREATED", "UPDATED", "DELETED"],
      required: true,
    },
    message: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
