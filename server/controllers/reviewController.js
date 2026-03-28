const Review = require("../models/Review");
const Booking = require("../models/Booking");

exports.createReview = async (req, res) => {
  try {
    const { bookingId, stars, comment } = req.body;
    if (!bookingId || !stars) {
      return res
        .status(400)
        .json({ message: "bookingId and stars are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.clientId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const review = await Review.create({
      bookingId,
      clientId: req.user._id,
      workerId: booking.workerId,
      stars: Number(stars),
      comment: comment || "",
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.listForWorker = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
