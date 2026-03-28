const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  myWorkerProfile,
  addProfession,
  listWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
} = require("../controllers/workerController");

router.get("/me/profile", protect, myWorkerProfile);
router.post("/me/professions", protect, addProfession);
router.get("/", listWorkers);
router.get("/:id", getWorker);
router.post("/", protect, createWorker);
router.patch("/:id", protect, updateWorker);
router.delete("/:id", protect, deleteWorker);

module.exports = router;
