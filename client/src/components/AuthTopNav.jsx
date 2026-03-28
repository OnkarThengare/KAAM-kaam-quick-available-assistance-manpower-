import { Link } from "react-router-dom";

/**
 * Fixed header for auth flows (login / signup / OTP).
 * @param {"login" | "signup" | "otp"} mode — controls which extra links are shown.
 */
export default function AuthTopNav({ mode = "login" }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#1E3A8A] transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E3A8A] text-sm font-bold text-white">
            K
          </span>
          <span className="text-lg font-bold tracking-tight">KAAM</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#1E3A8A]"
          >
            ← Homepage
          </Link>
          {mode !== "login" && (
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#1E3A8A]"
            >
              Log in
            </Link>
          )}
          {mode !== "signup" && mode !== "otp" && (
            <Link
              to="/signup"
              className="rounded-lg bg-[#F97316] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EA580C]"
            >
              Sign up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
