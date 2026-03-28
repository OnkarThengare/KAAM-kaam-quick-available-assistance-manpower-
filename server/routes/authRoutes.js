const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  signup,
  login,
  me,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");

router.get("/check", (req, res) => {
  res.json({ ok: true, service: "auth" });
});

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;
