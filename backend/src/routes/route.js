const express = require("express");
const { stock } = require("../controllers/yahoofinance");
const { searchStock } = require("../controllers/searchApi");
const router = express.Router();

router.get("/stock", stock);
router.get("/searchStock", searchStock);

module.exports = router;
