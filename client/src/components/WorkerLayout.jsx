import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import RouteLabel from "./RouteLabel";

const nav = [
  ["/worker/dashboard", "Dashboard"],
  ["/worker/jobs", "Find Jobs"],
  ["/worker/active-job", "Active Job"],
  ["/worker/history", "History"],
  ["/worker/profile", "Profile"],
];

export default function WorkerLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function logout() {
    localStorage.removeItem("kaam_token");
    localStorage.removeItem("kaam_user");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <p className="text-xl font-bold text-[#1E3A8A]">KAAM</p>
          <p className="text-xs text-slate-500">Service Concierge</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {nav.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#1E3A8A]/10 text-[#1E3A8A]"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-4 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="text-sm font-semibold text-[#1E3A8A]">Worker Portal</div>
          <div className="flex items-center gap-4">
            <span className="h-8 w-8 rounded-full bg-slate-200" />
            <div className="text-right text-sm">
              <p className="font-semibold text-slate-800">Professional</p>
              <p className="text-xs text-slate-500">Worker account</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
      <RouteLabel path={pathname} />
    </div>
  );
}
