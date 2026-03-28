import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import AuthTopNav from "../components/AuthTopNav";
import RouteLabel from "../components/RouteLabel";

function maskEmail(em) {
  if (!em || !em.includes("@")) return em;
  const [u, domain] = em.split("@");
  if (u.length <= 2) return `••••@${domain}`;
  return `${u.slice(0, 2)}••••${u.slice(-1)}@${domain}`;
}

export default function Otp() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSentFlag, setEmailSentFlag] = useState(() =>
    sessionStorage.getItem("kaam_email_sent") !== "0"
  );
  const [emailHint, setEmailHint] = useState(
    () => sessionStorage.getItem("kaam_email_hint") || ""
  );
  const [devOtp, setDevOtp] = useState(() =>
    sessionStorage.getItem("kaam_dev_otp") || ""
  );
  const navigate = useNavigate();
  const email = sessionStorage.getItem("kaam_pending_email") || "";
  const pendingRole = sessionStorage.getItem("kaam_pending_role") || "client";

  useEffect(() => {
    setDevOtp(sessionStorage.getItem("kaam_dev_otp") || "");
    inputsRef.current[0]?.focus();
  }, []);

  const code = digits.join("");

  const setDigitAt = useCallback((index, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  function onKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function onPaste(e) {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    const next = t.split("");
    while (next.length < 6) next.push("");
    setDigits(next.slice(0, 6));
    const focusIdx = Math.min(t.length, 5);
    inputsRef.current[focusIdx]?.focus();
  }

  async function verify(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (code.length !== 6) {
      setErr("Enter all 6 digits");
      return;
    }
    setLoading(true);
    try {
      const data = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
          role: sessionStorage.getItem("kaam_pending_role") || "client",
        }),
      });
      localStorage.setItem("kaam_token", data.token);
      localStorage.setItem("kaam_user", JSON.stringify(data.user));
      sessionStorage.removeItem("kaam_pending_email");
      sessionStorage.removeItem("kaam_pending_role");
      sessionStorage.removeItem("kaam_dev_otp");
      sessionStorage.removeItem("kaam_email_sent");
      sessionStorage.removeItem("kaam_email_hint");

      const resolvedRole =
        data.user?.role === "worker" ? "worker" : "client";
      if (resolvedRole === "worker") {
        navigate("/worker/dashboard", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      const data = await api("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      sessionStorage.setItem(
        "kaam_email_sent",
        data.emailSent !== false ? "1" : "0"
      );
      setEmailSentFlag(data.emailSent !== false);
      if (data.emailSetupHint) {
        sessionStorage.setItem("kaam_email_hint", data.emailSetupHint);
        setEmailHint(data.emailSetupHint);
      } else {
        sessionStorage.removeItem("kaam_email_hint");
        setEmailHint("");
      }
      if (data.devOtp) {
        sessionStorage.setItem("kaam_dev_otp", data.devOtp);
        setDevOtp(data.devOtp);
        setInfo("New verification code is ready (see demo box below).");
      } else if (data.emailSent !== false) {
        setErr("");
        setInfo(
          "Check your inbox and spam folder. The code expires in 10 minutes."
        );
      } else {
        setInfo("");
        setErr(
          data.emailSetupHint ||
            "Email was not sent. On the server, set GMAIL_USER + GMAIL_APP_PASSWORD, or RESEND_API_KEY, or SMTP_* (see DEPLOY.md)."
        );
      }
    } catch (e) {
      setErr(
        e.message ||
          "Could not reach the API. Is the backend running on port 8000 with /api?"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return (
      <>
        <AuthTopNav mode="otp" />
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-[#F8FAFC] px-4 pt-14">
          <p className="text-slate-600">
            No pending signup.{" "}
            <Link to="/signup" className="font-medium text-[#1E3A8A]">
              Go to signup
            </Link>
          </p>
          <RouteLabel path="/otp" />
        </div>
      </>
    );
  }

  const showDemo = Boolean(devOtp);
  const showEmailWarning = !showDemo && emailSentFlag === false;

  return (
    <>
      <AuthTopNav mode="otp" />
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-[#F8FAFC] to-[#eef2ff] px-4 pb-12 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-[15%] bottom-[25%] h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E3A8A] shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="mt-4 text-xl font-bold tracking-tight text-[#1E3A8A]">KAAM</p>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Service Concierge Security
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="text-center text-xl font-bold text-[#1E3A8A]">
          Verify your account
        </h1>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Registering as{" "}
          <span className="text-[#F97316]">
            {pendingRole === "worker" ? "worker (professional)" : "client"}
          </span>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          We&apos;ve sent a <strong>6-digit verification code</strong> to your email{" "}
          <span className="whitespace-nowrap font-medium text-slate-800">
            {maskEmail(email)}
          </span>
          .
        </p>

        {showEmailWarning && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-left text-xs text-amber-950">
            <strong>Email delivery issue:</strong> the server did not send a message to your
            inbox. Your account exists — fix outbound mail on the API host, then use{" "}
            <strong>Resend code</strong>. {emailHint && <span className="mt-1 block font-mono text-[11px] opacity-90">{emailHint}</span>}
          </div>
        )}

        {showDemo && (
          <div className="mt-4 rounded-xl border border-dashed border-[#F97316]/60 bg-orange-50/90 px-3 py-2 text-center text-xs text-amber-900">
            <strong>Demo mode:</strong> your code is{" "}
            <span className="font-mono text-lg font-bold tracking-widest">{devOtp}</span>
            <br />
            <span className="text-amber-800/90">
              Set <code className="rounded bg-white px-1">DEMO_MODE=false</code> in
              production and configure SMTP to send real emails.
            </span>
          </div>
        )}

        <form onSubmit={verify} className="mt-8" onPaste={onPaste}>
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                value={d}
                onChange={(e) => setDigitAt(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                className={`h-12 w-11 rounded-xl border-2 text-center text-xl font-semibold outline-none transition sm:h-14 sm:w-12 ${
                  i === 0 && !d
                    ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20"
                    : "border-slate-200 bg-slate-50 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                }`}
              />
            ))}
          </div>

          {err && (
            <p className="mt-4 text-center text-sm text-red-600">{err}</p>
          )}
          {info && (
            <p className="mt-4 text-center text-sm text-emerald-700">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#172554] disabled:opacity-60"
          >
            Verify →
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="font-semibold text-[#F97316] hover:underline disabled:opacity-50"
          >
            Resend Code
          </button>
        </p>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 hover:text-[#1E3A8A]"
          >
            ← Back to Login
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex gap-8 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        <span className="flex items-center gap-1">🛡 Secure</span>
        <span className="flex items-center gap-1">🔒 Encrypted</span>
        <span className="flex items-center gap-1">⚡ Fast</span>
      </div>

      <RouteLabel path="/otp" />
    </div>
    </>
  );
}
