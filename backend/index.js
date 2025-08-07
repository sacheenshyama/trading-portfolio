require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
// const { connectRedis } = require("./src/config/redis");
const app = require("./src/app");
const { connectRedis } = require("./src/config/redis");

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    await connectRedis();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
