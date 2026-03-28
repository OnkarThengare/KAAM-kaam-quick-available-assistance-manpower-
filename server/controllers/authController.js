const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/token");
const { sendOtpEmail } = require("../utils/emailOtp");
const {
  ensureWorkerProfileForUser,
} = require("./workerController");

const SALT_ROUNDS = 10;
const OTP_TTL_MS = 10 * 60 * 1000;

function normalizeRole(role) {
  const s = String(role ?? "")
    .toLowerCase()
    .trim();
  return s === "worker" ? "worker" : "client";
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function shouldExposeOtpInApi() {
  return (
    process.env.OTP_DEBUG === "true" ||
    process.env.DEMO_MODE === "true"
  );
}

function logOtp(email, otp) {
  if (shouldExposeOtpInApi()) {
    console.log(`[KAAM OTP] ${email} → ${otp} (expires in 10 min)`);
  }
}

function publicUser(doc) {
  if (!doc) return null;
  const o = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete o.password;
  delete o.otpCode;
  delete o.otpExpires;
  return o;
}

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (confirmPassword && confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const otp = genOtp();
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: normalizeRole(role),
      otpCode: otp,
      otpExpires: new Date(Date.now() + OTP_TTL_MS),
    });

    logOtp(user.email, otp);
    const mail = await sendOtpEmail(user.email, otp);

    const hasDevOtp = shouldExposeOtpInApi();
    let message = mail.ok
      ? "Account created. Check your email for the verification code."
      : "Account created. No email was sent (mail not configured or send failed).";

    if (!mail.ok && hasDevOtp) {
      message +=
        " Use the demo code on the verify screen (DEMO_MODE is on). For real mail, add GMAIL_USER + GMAIL_APP_PASSWORD in server/.env.";
    } else if (!mail.ok && !hasDevOtp) {
      message +=
        " Add GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY in server/.env, then resend OTP.";
    }

    const payload = {
      success: true,
      message,
      email: user.email,
      user: publicUser(user),
      emailSent: mail.ok,
    };

    if (!mail.ok && mail.error) {
      payload.emailSetupHint = mail.error;
    }

    if (hasDevOtp) {
      payload.devOtp = otp;
    }

    res.status(201).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, code, role: roleFromClient } = req.body;
    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email and OTP code are required" });
    }

    const user = await User.findOne({ email }).select("+otpCode");
    if (!user || !user.otpCode) {
      return res.status(400).json({ message: "No pending verification for this email" });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (String(user.otpCode) !== String(code).trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (
      roleFromClient !== undefined &&
      roleFromClient !== null &&
      String(roleFromClient).trim() !== ""
    ) {
      user.role = normalizeRole(roleFromClient);
    }

    user.otpCode = "";
    user.otpExpires = null;
    await user.save();

    if (user.role === "worker") {
      await ensureWorkerProfileForUser(user);
    }

    const token = signToken(user._id, user.role);
    const fresh = await User.findById(user._id).lean();

    res.json({
      success: true,
      message: "Verified",
      token,
      user: publicUser(fresh),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = genOtp();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    logOtp(email, otp);
    const mail = await sendOtpEmail(email, otp);

    const payload = {
      success: true,
      message: mail.ok ? "OTP sent to your email." : "OTP updated but email was not delivered.",
      emailSent: mail.ok,
    };
    if (!mail.ok && mail.error) {
      payload.emailSetupHint = mail.error;
    }
    if (shouldExposeOtpInApi()) {
      payload.devOtp = otp;
    }

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === "worker") {
      await ensureWorkerProfileForUser(user);
    }

    const token = signToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.me = (req, res) => {
  res.json({ user: req.user });
};
