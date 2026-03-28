import { Link } from "react-router-dom";

export default function ClientDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Client Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome to KAAM — book trusted professionals in minutes.
      </p>
      <Link
        to="/client/services"
        className="mt-8 inline-block rounded-xl bg-[#1E3A8A] px-8 py-4 text-sm font-semibold text-white"
      >
        Find Worker
      </Link>
    </div>
  );
}
