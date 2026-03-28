import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import AuthTopNav from "../components/AuthTopNav";
import RouteLabel from "../components/RouteLabel";
import PasswordInput from "../components/PasswordInput";

const signupSide =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80";

export default function Signup() {
  const [params] = useSearchParams();
  const roleQ = params.get("role") || "client";
  const [role, setRole] = useState(roleQ === "worker" ? "worker" : "client");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    try {
      const data = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          role,
        }),
      });
      sessionStorage.setItem("kaam_pending_email", form.email);
      sessionStorage.setItem("kaam_pending_role", role);
      sessionStorage.setItem(
        "kaam_email_sent",
        data.emailSent !== false ? "1" : "0"
      );
      if (data.emailSetupHint) {
        sessionStorage.setItem("kaam_email_hint", data.emailSetupHint);
      } else {
        sessionStorage.removeItem("kaam_email_hint");
      }
      if (data.devOtp) {
        sessionStorage.setItem("kaam_dev_otp", data.devOtp);
      }
      navigate("/otp");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <>
      <AuthTopNav mode="signup" />
      <div className="flex min-h-screen bg-[#F8FAFC] pt-14">
        <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-16">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-slate-900">Join the Concierge.</h1>
          <p className="mt-2 text-slate-600">
            Connecting skilled professionals with premium local services.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`rounded-xl border-2 p-4 text-left text-sm font-semibold ${
                role === "worker"
                  ? "border-[#1E3A8A] bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              👷 Worker
              <div className="text-xs font-normal text-slate-500">
                I offer services
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`rounded-xl border-2 p-4 text-left text-sm font-semibold ${
                role === "client"
                  ? "border-[#1E3A8A] bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              🏠 Client
              <div className="text-xs font-normal text-slate-500">
                I&apos;m hiring help
              </div>
            </button>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
              <input
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                required
              />
            </div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <PasswordInput
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />
              <PasswordInput
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                required
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" required />I agree to the{" "}
              <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
            </label>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#1E3A8A] py-3 text-sm font-semibold text-white shadow-md"
            >
              Create Account
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#F97316]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden w-[45%] lg:flex">
        <img
          src={signupSide}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/95 via-[#1E3A8A]/40 to-transparent" />
        <div className="relative z-10 mt-auto flex flex-col justify-end p-12 text-white">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur">
            <span className="text-[#F97316]">✓</span>
            Trust through Transparency
          </div>
          <p className="text-2xl font-semibold">Join 5,000+ verified experts</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-blue-200">Avg rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold">12k+</p>
              <p className="text-blue-200">Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Instant</p>
              <p className="text-blue-200">Payouts</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <RouteLabel path="/signup" />
    </>
  );
}
