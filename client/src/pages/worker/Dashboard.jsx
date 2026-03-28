import { Link } from "react-router-dom";

export default function WorkerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Worker Dashboard</h1>
      <p className="mt-2 text-slate-600">You have new job requests in your area.</p>
      <div className="mt-8 flex items-center gap-4">
        <span className="text-sm font-medium">Availability</span>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
          ONLINE
        </span>
      </div>
      <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="font-semibold">Profile overview</p>
        <p className="mt-2 text-sm text-slate-600">
          Complete your profile and keep availability on to receive requests.
        </p>
        <Link
          to="/worker/jobs"
          className="mt-6 inline-block rounded-xl bg-[#1E3A8A] px-8 py-4 text-sm font-semibold text-white"
        >
          View Jobs
        </Link>
      </div>
    </div>
  );
}
