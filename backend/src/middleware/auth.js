const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { redisClient } = require("../config/redis");

const authMiddleware = async (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");

  const token =
    req.cookies.jwtToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({  error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionData = await redisClient.get(`session:${decoded.id}`);

    if (!sessionData) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }

    req.user = JSON.parse(sessionData);
    if (!req.user) throw new Error();
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
