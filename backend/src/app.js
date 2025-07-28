const express = require("express");
const cors = require("cors");
const app = express();
const Routes = require("./routes/route");
// const morgon=require('m')
const morgan = require("morgan");
const { METHODS } = require("http");

const corsOptions = {
  origin:
    process.env.FRONTEND_URL || "https://trading-portfolio-one.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(morgan());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", Routes);
module.exports = app;
