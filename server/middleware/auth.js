const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("JWT_SECRET is not set");
  }
  return s;
}

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token =
      header && header.startsWith("Bearer ")
        ? header.slice(7)
        : null;
    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const decoded = jwt.verify(token, getSecret());
    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { protect, restrictTo };
