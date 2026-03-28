/**
 * Sends OTP emails. Configure ONE of:
 * 1) GMAIL_USER + GMAIL_APP_PASSWORD (Gmail — use an App Password, not your login password)
 * 2) RESEND_API_KEY (+ optional RESEND_FROM)
 * 3) SMTP_HOST + SMTP_USER + SMTP_PASS (generic; Gmail works with host smtp.gmail.com)
 */

const nodemailer = require("nodemailer");

async function sendViaResend(to, otp) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  const from =
    process.env.RESEND_FROM || "KAAM <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Your KAAM verification code",
      html: otpEmailHtml(otp),
      text: otpEmailText(otp),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error?.message || `Resend HTTP ${res.status}`
    );
  }
  return "resend";
}

function otpEmailText(otp) {
  return `Your KAAM verification code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, ignore this email.`;
}

function otpEmailHtml(otp) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #1e3a8a;">KAAM — verify your email</h2>
  <p>Use this code to finish signing up:</p>
  <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1e3a8a;">${otp}</p>
  <p style="color: #64748b; font-size: 14px;">Valid for 10 minutes. Do not share this code.</p>
</body>
</html>`;
}

function normalizePass(raw) {
  if (!raw) return "";
  return String(raw).replace(/\s/g, "").replace(/^\uFEFF/, "");
}

/**
 * Explicit Gmail SMTP (465) is more reliable than service: "gmail" on some networks.
 */
function createGmailTransport(user, pass) {
  const u = user.trim();
  const p = normalizePass(pass);
  if (!u || !p) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: u, pass: p },
    connectionTimeout: 25_000,
    greetingTimeout: 25_000,
  });
}

async function sendWithTransporter(transporter, fromHeader, to, otp) {
  await transporter.sendMail({
    from: fromHeader,
    to,
    subject: "Your KAAM verification code",
    text: otpEmailText(otp),
    html: otpEmailHtml(otp),
  });
}

/** Try port 465, then 587+STARTTLS if the first send fails (some firewalls block 465). */
async function sendGmailOtp(user, pass, to, otp) {
  const fromHeader = `KAAM <${user.trim()}>`;
  const t465 = createGmailTransport(user, pass);
  if (!t465) return null;

  try {
    await sendWithTransporter(t465, fromHeader, to, otp);
    return "gmail";
  } catch (_firstErr) {
    const t587 = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: user.trim(),
        pass: normalizePass(pass),
      },
      connectionTimeout: 25_000,
    });
    await sendWithTransporter(t587, fromHeader, to, otp);
    return "gmail";
  }
}

async function sendViaNodemailer(to, otp) {
  const gUser = process.env.GMAIL_USER;
  const gPass = process.env.GMAIL_APP_PASSWORD;
  if (gUser && gPass) {
    return sendGmailOtp(gUser, gPass, to, otp);
  }

  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ? normalizePass(process.env.SMTP_PASS) : "";
  if (!user || !pass) return null;

  const isGmailHost = /gmail\.com/i.test(host);

  if (isGmailHost) {
    return sendGmailOtp(user, pass, to, otp);
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
    connectionTimeout: 25_000,
  });

  const fromRaw = process.env.SMTP_FROM || user;
  const fromHeader = fromRaw.includes("<") ? fromRaw : `KAAM <${fromRaw}>`;

  await sendWithTransporter(transporter, fromHeader, to, otp);
  return "smtp";
}

/**
 * @returns {{ ok: boolean, provider?: string, error?: string }}
 */
async function sendOtpEmail(to, otp) {
  if (!to || !otp) {
    return { ok: false, error: "Missing recipient or OTP" };
  }

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      const provider = await sendViaResend(to, otp);
      console.log(`[KAAM] OTP email sent via ${provider} → ${to}`);
      return { ok: true, provider };
    }

    const nm = await sendViaNodemailer(to, otp);
    if (nm) {
      console.log(`[KAAM] OTP email sent via ${nm} → ${to}`);
      return { ok: true, provider: nm };
    }

    return {
      ok: false,
      error:
        "No mail credentials in server .env. Add GMAIL_USER + GMAIL_APP_PASSWORD (Gmail App Password) or RESEND_API_KEY — see server/.env.example",
    };
  } catch (err) {
    let msg = err.message || String(err);
    if (/Invalid login|EAUTH|535|534/i.test(msg)) {
      msg +=
        " — For Gmail: enable 2-Step Verification and create an App Password at https://myaccount.google.com/apppasswords (do not use your normal Gmail password).";
    }
    console.error(`[KAAM] OTP email failed for ${to}:`, msg);
    return { ok: false, error: msg };
  }
}

function isEmailConfigured() {
  return !!(
    process.env.RESEND_API_KEY?.trim() ||
    (process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim()) ||
    (process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim())
  );
}

function emailConfigSummary() {
  if (process.env.RESEND_API_KEY?.trim()) return "resend";
  if (process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim())
    return "gmail";
  if (
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS?.trim()
  )
    return "smtp";
  return "off";
}

module.exports = { sendOtpEmail, isEmailConfigured, emailConfigSummary };
