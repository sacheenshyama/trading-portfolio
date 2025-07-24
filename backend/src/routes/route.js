const express = require("express");
const { stock } = require("../controllers/yahoofinance");
const { searchStock } = require("../controllers/searchApi");
const { signup, signin } = require("../controllers/auth");
const { createPortfolio, getPortfolio } = require("../controllers/portfolio");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/stock", stock);
router.get("/searchStock", searchStock);

router.post("/createPortfolio", authMiddleware, createPortfolio);
router.get("/getPortfolio", authMiddleware, getPortfolio);

module.exports = router;
