const mongoose = require("mongoose");

const openJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    service: { type: String, trim: true, default: "" },
    distanceKm: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    description: { type: String, trim: true, default: "" },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "accepted"],
      default: "open",
    },
    acceptedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OpenJob", openJobSchema);
