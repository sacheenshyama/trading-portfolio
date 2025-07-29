const express = require("express");
require("dotenv").config();

const cors = require("cors");
const app = express();
const Routes = require("./routes/route");
const morgan = require("morgan");
const { METHODS } = require("http");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(morgan());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", Routes);
module.exports = app;
