const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["client", "worker"],
      default: "client",
    },
    otpCode: { type: String, default: "" },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  const o = this.toObject();
  delete o.password;
  delete o.otpCode;
  return o;
};

module.exports = mongoose.model("User", userSchema);
