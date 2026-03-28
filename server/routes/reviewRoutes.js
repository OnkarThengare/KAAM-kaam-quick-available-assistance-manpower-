const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  createReview,
  listForWorker,
} = require("../controllers/reviewController");

router.post("/", protect, restrictTo("client"), createReview);
router.get("/worker/:workerId", listForWorker);

module.exports = router;
