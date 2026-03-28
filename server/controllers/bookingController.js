const Booking = require("../models/Booking");
const Worker = require("../models/Worker");

function genPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

exports.createBooking = async (req, res) => {
  try {
    const {
      workerId,
      notes,
      scheduledAt,
      serviceCategory,
      serviceType,
      address,
      priceEstimate,
    } = req.body;
    if (!workerId) {
      return res.status(400).json({ message: "workerId is required" });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const booking = await Booking.create({
      clientId: req.user._id,
      workerId,
      notes,
      serviceCategory,
      serviceType,
      address,
      priceEstimate: priceEstimate != null ? Number(priceEstimate) : 0,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      status: "confirmed",
      servicePin: genPin(),
    });

    const populated = await Booking.findById(booking._id)
      .populate("workerId", "name profession location rating photo hourlyRate")
      .populate("clientId", "firstName lastName email")
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.listBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "worker") {
      const myWorker = await Worker.findOne({ userId: req.user._id }).select(
        "_id"
      );
      if (!myWorker) {
        return res.json({ count: 0, bookings: [] });
      }
      query.workerId = myWorker._id;
    } else {
      query.clientId = req.user._id;
    }

    let bookings = await Booking.find(query)
      .populate("workerId", "name profession location rating photo")
      .populate("clientId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    if (req.user.role === "worker") {
      bookings = bookings.map((b) => {
        const x = { ...b };
        delete x.servicePin;
        return x;
      });
    }

    res.json({ count: bookings.length, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("workerId", "name profession location rating phone photo")
      .populate("clientId", "firstName lastName email")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isClient =
      booking.clientId &&
      String(booking.clientId._id || booking.clientId) ===
        String(req.user._id);
    let isAssignedWorker = false;
    if (req.user.role === "worker") {
      const myWorker = await Worker.findOne({ userId: req.user._id });
      if (
        myWorker &&
        String(booking.workerId._id || booking.workerId) ===
          String(myWorker._id)
      ) {
        isAssignedWorker = true;
      }
    }

    if (!isClient && !isAssignedWorker) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (isAssignedWorker && !isClient) {
      delete booking.servicePin;
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getClientPin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.clientId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ servicePin: booking.servicePin, bookingId: booking._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.regeneratePin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.clientId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    booking.servicePin = genPin();
    await booking.save();
    res.json({ servicePin: booking.servicePin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ message: "PIN required" });
    }

    const myWorker = await Worker.findOne({ userId: req.user._id });
    if (!myWorker) {
      return res.status(403).json({ message: "Worker profile not found" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.workerId) !== String(myWorker._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (String(booking.servicePin) !== String(pin).trim()) {
      return res.status(400).json({ message: "Incorrect PIN" });
    }

    booking.pinVerified = true;
    booking.status = "in_progress";
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("workerId", "name profession location rating")
      .populate("clientId", "firstName lastName email phone")
      .lean();
    delete populated.servicePin;

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${allowed.join(", ")}`,
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isClient = String(booking.clientId) === String(req.user._id);
    let isAssignedWorker = false;
    if (req.user.role === "worker") {
      const myWorker = await Worker.findOne({ userId: req.user._id });
      if (myWorker && String(booking.workerId) === String(myWorker._id)) {
        isAssignedWorker = true;
      }
    }

    if (!isClient && !isAssignedWorker) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.status = status;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("workerId", "name profession location rating")
      .populate("clientId", "firstName lastName email")
      .lean();

    if (req.user.role === "worker") delete populated.servicePin;

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.workerActiveBooking = async (req, res) => {
  try {
    const myWorker = await Worker.findOne({ userId: req.user._id });
    if (!myWorker) {
      return res.json(null);
    }

    const booking = await Booking.findOne({
      workerId: myWorker._id,
      status: { $in: ["confirmed", "in_progress"] },
    })
      .sort({ updatedAt: -1 })
      .populate("clientId", "firstName lastName email phone")
      .populate("workerId", "name profession")
      .lean();

    if (booking) delete booking.servicePin;
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.workerHistory = async (req, res) => {
  try {
    const myWorker = await Worker.findOne({ userId: req.user._id });
    if (!myWorker) {
      return res.json({ bookings: [], totalEarnings: 0 });
    }

    const bookings = await Booking.find({
      workerId: myWorker._id,
      status: "completed",
    })
      .populate("clientId", "firstName lastName")
      .sort({ updatedAt: -1 })
      .lean();

    const totalEarnings = bookings.reduce(
      (s, b) => s + (Number(b.priceEstimate) || 0),
      0
    );

    res.json({ bookings, totalEarnings, count: bookings.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
