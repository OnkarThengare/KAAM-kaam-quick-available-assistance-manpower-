const Worker = require("../models/Worker");

/**
 * Ensures a Worker row exists for a worker-role user (signup / login / first profile load).
 */
async function ensureWorkerProfileForUser(user) {
  if (!user || user.role !== "worker" || !user._id) return null;
  let worker = await Worker.findOne({ userId: user._id });
  if (worker) return worker;

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    (user.email && String(user.email).split("@")[0]) ||
    "Professional";

  try {
    worker = await Worker.create({
      name,
      profession: "",
      professions: [],
      userId: user._id,
      phone: user.phone || "",
      bio: "",
      available: true,
    });
  } catch (e) {
    if (e.code === 11000) {
      worker = await Worker.findOne({ userId: user._id });
    } else {
      throw e;
    }
  }
  return worker;
}

exports.myWorkerProfile = async (req, res) => {
  try {
    let worker = await Worker.findOne({ userId: req.user._id }).lean();
    if (!worker && req.user.role === "worker") {
      const created = await ensureWorkerProfileForUser(req.user);
      worker = created ? created.toObject() : null;
    }
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.addProfession = async (req, res) => {
  try {
    const { profession } = req.body;
    if (!profession) {
      return res.status(400).json({ message: "profession is required" });
    }
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }
    if (!worker.professions) worker.professions = [];
    const p = profession.trim();
    if (p && !worker.professions.includes(p)) {
      worker.professions.push(p);
    }
    await worker.save();
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.listWorkers = async (req, res) => {
  try {
    const { profession, location, available } = req.query;
    const filter = {};
    if (profession) filter.profession = new RegExp(profession, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (available === "true") filter.available = true;
    if (available === "false") filter.available = false;

    const workers = await Worker.find(filter).sort({ rating: -1 }).lean();
    res.json({ count: workers.length, workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).lean();
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.createWorker = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ message: "Only worker accounts can create a worker profile" });
    }
    const existing = await Worker.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "Profile already exists", worker: existing });
    }
    const { name, profession, experience, location, rating, phone, available } =
      req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const worker = await Worker.create({
      name,
      profession,
      experience,
      location,
      rating,
      phone,
      available,
      userId: req.user._id,
    });
    res.status(201).json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const existing = await Worker.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Worker not found" });
    }
    if (String(existing.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    if (String(worker.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: "Worker removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.ensureWorkerProfileForUser = ensureWorkerProfileForUser;
