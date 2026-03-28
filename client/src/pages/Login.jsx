import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import AuthTopNav from "../components/AuthTopNav";
import RouteLabel from "../components/RouteLabel";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("kaam_token", data.token);
      localStorage.setItem("kaam_user", JSON.stringify(data.user));
      if (data.user.role === "worker") {
        navigate("/worker/dashboard", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <>
      <AuthTopNav mode="login" />
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 pt-20 sm:pt-24">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="hidden w-[44%] flex-col justify-between bg-gradient-to-br from-[#1E3A8A] to-[#172554] p-10 text-white lg:flex">
          <div>
            <h1 className="text-2xl font-bold">KAAM</h1>
            <p className="text-xs tracking-widest text-blue-200">
              SERVICE CONCIERGE
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold leading-snug">
              Welcome to your digital concierge.
            </p>
            <p className="mt-4 text-sm text-blue-100">
              Connect with premium service professionals. Trust, reliability,
              excellence in every task.
            </p>
            <div className="mt-8 flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-[#1E3A8A] bg-slate-300"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 5})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-blue-200">
              Joined by 2,000+ local experts
            </p>
          </div>
          <div className="flex gap-1">
            <span className="h-1 w-6 rounded-full bg-white" />
            <span className="h-1 w-2 rounded-full bg-white/40" />
            <span className="h-1 w-2 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your details to access your dashboard
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Email or phone
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  @
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">
                  Password
                </label>
                <span className="text-xs font-medium text-[#1E3A8A]">
                  Forgot?
                </span>
              </div>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" />
              Keep me logged in
            </label>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1E3A8A] py-3.5 text-sm font-semibold text-white shadow-md"
            >
              Sign In to KAAM →
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-slate-400">
              <span className="bg-white px-3">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="font-bold text-blue-500">G</span> Google
            </button>
            <Link
              to="/otp"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              📱 OTP
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#F97316]">
              Register Now
            </Link>
          </p>
        </div>
      </div>
      </div>
      <RouteLabel path="/login" />
    </>
  );
}
