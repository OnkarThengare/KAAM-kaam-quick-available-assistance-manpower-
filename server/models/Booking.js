const mongoose = require("mongoose");

function genPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const bookingSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "confirmed",
    },
    servicePin: { type: String, default: genPin },
    pinVerified: { type: Boolean, default: false },
    serviceCategory: { type: String, trim: true, default: "" },
    serviceType: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    priceEstimate: { type: Number, default: 0 },
    notes: { type: String, trim: true, default: "" },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ clientId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
