const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profession: { type: String, trim: true, default: "" },
    professions: [{ type: String, trim: true }],
    experience: { type: Number, default: 0, min: 0 },
    location: { type: String, trim: true, default: "" },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    phone: { type: String, trim: true, default: "" },
    hourlyRate: { type: Number, default: 0 },
    photo: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    available: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

workerSchema.index({ profession: 1, location: 1 });

module.exports = mongoose.model("Worker", workerSchema);
