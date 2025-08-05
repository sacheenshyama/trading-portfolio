const express = require("express");
const { stock } = require("../controllers/yahoofinance");
const { searchStock } = require("../controllers/searchApi");
const { signup, signin, logout, oAuthLogin } = require("../controllers/auth");
const {
  createPortfolio,
  getPortfolio,
  deletePortfolio,
  updatePortfolio,
} = require("../controllers/portfolio");
const authMiddleware = require("../middleware/auth");
const { getLiveStock } = require("../controllers/liveStock");
const {
  getActivityLog,
  deleteActivityLog,
} = require("../controllers/activityLog");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/oAuthLogin",oAuthLogin)
router.post("/logout", authMiddleware, logout);

// router.get("/stock", stock);
router.get("/searchStock", searchStock);
router.get("/liveStock", getLiveStock);

router.post("/createPortfolio", authMiddleware, createPortfolio);
router.get("/getPortfolio", authMiddleware, getPortfolio);
router.delete("/deletePortfolio/:id", authMiddleware, deletePortfolio);
router.put("/updatePortfolio/:id", authMiddleware, updatePortfolio);

router.get("/getActivity", authMiddleware, getActivityLog);
router.delete("/deleteActivity", authMiddleware, deleteActivityLog);

module.exports = router;
