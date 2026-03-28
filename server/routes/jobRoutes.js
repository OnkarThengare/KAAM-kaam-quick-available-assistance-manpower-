const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const { listOpenJobs, acceptJob } = require("../controllers/jobController");

router.use(protect, restrictTo("worker"));
router.get("/", listOpenJobs);
router.post("/:id/accept", acceptJob);

module.exports = router;
