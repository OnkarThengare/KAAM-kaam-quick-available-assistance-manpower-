import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const cat = sessionStorage.getItem("kaam_service_category") || "";
    const prof =
      cat === "electrician"
        ? "Electrician"
        : cat === "plumber"
          ? "Plumber"
          : cat === "cleaner"
            ? "Cleaner"
            : "";
    const q = prof ? `?profession=${encodeURIComponent(prof)}` : "";
    api(`/workers${q}`)
      .then((d) => setWorkers(d.workers || []))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Available Professionals</h1>
      <p className="mt-2 text-slate-600">
        Curated experts for your selected service.
      </p>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      <div className="mt-10 grid grid-cols-3 gap-6">
        {workers.map((w) => (
          <div
            key={w._id}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="h-40 bg-slate-200">
              {w.photo ? (
                <img
                  src={w.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-900">{w.name}</p>
              <p className="text-sm text-slate-500">{w.profession}</p>
              <p className="mt-2 text-sm">★ {w.rating}</p>
              <p className="text-sm">
                From ₹{w.hourlyRate || 299}/hr · {w.experience} yrs exp
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/client/worker/${w._id}`}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-sm"
                >
                  View Profile
                </Link>
                <Link
                  to={`/client/book/${w._id}`}
                  className="flex-1 rounded-lg bg-[#F97316] py-2 text-center text-sm font-semibold text-white"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
