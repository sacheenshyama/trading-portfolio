const { default: mongoose } = require("mongoose");
const { redisClient } = require("../config/redis");
const ActivityLog = require("../models/ActivityLog");

const getActivityLog = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `activityLog:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const logs = await ActivityLog.find({ owner: userId })
      .lean()
      .sort({ createdAt: -1 });

    if (logs.length === 0) {
      return res.status(203).json([]);
    }

    await redisClient.set(cacheKey, JSON.stringify(logs), { EX: 300 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch logs" });
  }
};
const deleteActivityLog = async (req, res) => {
  const { logId } = req.body;
  const owner = req.user._id;
  // console.log("log-id: ", logId);
  // console.log("req.body: ", req.body);

  if (!Array.isArray(logId) || logId.length === 0) {
    return res.status(400).json({ message: "No log IDS provided" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedLogs = await ActivityLog.deleteMany(
      {
        _id: { $in: logId },
        owner,
      },
      { session }
    );
    await redisClient.del(`activityLog:${owner.toString()}`);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Activity logs deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error while deleting logs", error);
    res.status(500).json({
      error: error.message || "Failed to delete activity logs",
    });
  }
};

module.exports = {
  getActivityLog,
  deleteActivityLog,
};
