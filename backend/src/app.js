const express = require("express");
const cors = require("cors");
const app = express();
const Routes = require("./routes/route");
// const morgon=require('m')
app.use(express.json());
app.use(cors());

app.use("/api", Routes);
module.exports = app;
