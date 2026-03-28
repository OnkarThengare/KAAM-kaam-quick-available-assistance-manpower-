const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  getClientPin,
  regeneratePin,
  verifyPin,
  workerActiveBooking,
  workerHistory,
} = require("../controllers/bookingController");

router.use(protect);

router.post("/", restrictTo("client"), createBooking);
router.get("/worker/active", restrictTo("worker"), workerActiveBooking);
router.get("/worker/history", restrictTo("worker"), workerHistory);
router.get("/", listBookings);
router.get("/:id/pin", restrictTo("client"), getClientPin);
router.post("/:id/regenerate-pin", restrictTo("client"), regeneratePin);
router.post("/:id/verify-pin", restrictTo("worker"), verifyPin);
router.get("/:id", getBooking);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
