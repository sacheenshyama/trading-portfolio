const express = require("express");
const { stockSearch } = require("../controllers/yahoofinance");
const router = express.Router();

router.get("/stocksearch", stockSearch);

module.exports = router;
