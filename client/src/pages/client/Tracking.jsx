import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LiveMap from "../../components/LiveMap";

/** Bengaluru — demo service area */
const CLIENT = [12.9716, 77.5946];

export default function Tracking() {
  const start = useMemo(
    () => [CLIENT[0] - 0.012, CLIENT[1] - 0.014],
    []
  );
  const [proPos, setProPos] = useState(start);
  const [eta, setEta] = useState(14);

  useEffect(() => {
    const move = setInterval(() => {
      setProPos(([la, lo]) => {
        const [tla, tlo] = CLIENT;
        const nla = la + (tla - la) * 0.12;
        const nlo = lo + (tlo - lo) * 0.12;
        return [nla, nlo];
      });
      setEta((e) => Math.max(0, e - 1));
    }, 1500);
    return () => clearInterval(move);
  }, []);

  return (
    <div>
      <p className="text-sm text-slate-500">My Bookings › Live Tracking</p>
      <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A]">
        Track Your Professional
      </h1>
      <p className="mt-2 text-slate-600">
        Live OpenStreetMap view — professional position updates as they approach
        (demo simulation).
      </p>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <LiveMap
          height={420}
          clientLatLng={CLIENT}
          professionalLatLng={proPos}
          showServiceArea
          serviceRadiusM={850}
        />
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#F97316]">
              Live status
            </p>
            <p className="mt-2 font-semibold text-slate-900">Worker en route</p>
            <p className="text-sm text-slate-500">
              ETA ~{eta} min · Light traffic · OpenStreetMap routing (demo)
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              Tip: zoom and pan the map. In production, pair with live GPS from
              the worker app.
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-[#1E3A8A] py-2 text-sm text-white"
            >
              Call Worker
            </button>
          </div>
          <Link
            to="/client/review"
            className="block rounded-xl bg-[#F97316] py-4 text-center text-sm font-bold text-white shadow-md transition hover:opacity-95"
          >
            Job Completed
          </Link>
        </div>
      </div>
    </div>
  );
}
