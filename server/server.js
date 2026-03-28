require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("Missing environment variable: MONGO_URI");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("Missing environment variable: JWT_SECRET");
    process.exit(1);
  }
  process.env.JWT_SECRET =
    "kaam-dev-only-do-not-use-in-production-rotate-me";
  console.warn(
    "JWT_SECRET is not set in .env — using a development default. Add JWT_SECRET to .env before production."
  );
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  isEmailConfigured,
  emailConfigSummary,
} = require("./utils/emailOtp");

const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PREFERRED_PORT = Number(process.env.PORT) || 8000;
const MAX_PORT_TRIES = 25;

const jobRoutes = require("./routes/jobRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin.includes(",")
      ? clientOrigin.split(",").map((s) => s.trim())
      : clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Root: HTML for browsers, JSON for scripts / health probes without Accept: text/html
app.get("/", (req, res) => {
  const wantsHtml = (req.get("Accept") || "").includes("text/html");
  if (wantsHtml) {
    res
      .status(200)
      .type("html")
      .send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>KAAM API</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;color:#1e293b;line-height:1.5}
    h1{color:#1e3a8a;font-size:1.25rem}
    a{color:#1e3a8a}
    code{background:#f1f5f9;padding:.15rem .4rem;border-radius:.25rem;font-size:.9em}
  </style>
</head>
<body>
  <h1>KAAM API is running</h1>
  <p>This URL is the <strong>backend only</strong>. The React app is deployed separately.</p>
  <p>Status JSON: <a href="/api"><code>GET /api</code></a></p>
  <p>Deploy the <code>client/</code> folder (e.g. Vercel) and set <code>VITE_API_URL</code> to this host + <code>/api</code>.</p>
</body>
</html>`);
    return;
  }
  res.status(200).json({
    service: "KAAM API",
    health: "ok",
    detail: "/api",
  });
});

app.get("/api", (req, res) => {
  res.json({
    name: "KAAM API",
    version: "1.1.0",
    health: "ok",
    emailConfigured: isEmailConfigured(),
    emailMode: emailConfigSummary(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

function startListening(port) {
  const server = app.listen(port, () => {
    if (port !== PREFERRED_PORT) {
      console.warn(
        `Port ${PREFERRED_PORT} was already in use. Using ${port} — free ${PREFERRED_PORT} or set PORT in .env to match.`
      );
    }
    console.log(`Server listening on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code !== "EADDRINUSE") {
      console.error(err);
      process.exit(1);
    }
    const next = port + 1;
    const overLimit =
      process.env.NODE_ENV === "production" ||
      next > PREFERRED_PORT + MAX_PORT_TRIES;
    if (overLimit) {
      console.error(
        `Port ${PREFERRED_PORT} is in use (EADDRINUSE). Close the other process or pick another PORT in .env. Example (Windows): netstat -ano | findstr :${PREFERRED_PORT}`
      );
      process.exit(1);
    }
    server.close(() => startListening(next));
  });

  return server;
}

(async () => {
  try {
    await connectDB();
    const mode = emailConfigSummary();
    if (mode === "off") {
      console.warn(
        "[KAAM] Outbound email is OFF (emailMode=off). OTPs are NOT sent by mail. Add to server/.env:\n" +
          "  GMAIL_USER=you@gmail.com\n" +
          "  GMAIL_APP_PASSWORD=<16-char App Password from Google Account → Security → App passwords>\n" +
          "Or use RESEND_API_KEY. With DEMO_MODE=true the OTP still appears in the API/UI for testing."
      );
    } else {
      console.log(`[KAAM] Outbound email mode: ${mode}`);
    }
    startListening(PREFERRED_PORT);
  } catch {
    process.exit(1);
  }
})();
