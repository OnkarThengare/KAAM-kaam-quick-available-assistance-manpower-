import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../api";

export default function Pin() {
  const loc = useLocation();
  const fromState = loc.state?.booking;
  const bookingId =
    fromState?._id || sessionStorage.getItem("kaam_last_booking_id");
  const [pin, setPin] = useState(fromState?.servicePin || "");
  const [err, setErr] = useState("");
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    if (!bookingId) return;
    if (fromState?.servicePin) {
      setPin(String(fromState.servicePin));
      if (fromState.workerId?.name) setWorker(fromState.workerId);
      return;
    }
    api(`/bookings/${bookingId}/pin`)
      .then((d) => setPin(String(d.servicePin)))
      .catch((e) => setErr(e.message));
    api(`/bookings/${bookingId}`)
      .then((b) => {
        const w = b.workerId;
        if (w && typeof w === "object") setWorker(w);
      })
      .catch(() => {});
  }, [bookingId, fromState]);

  async function regenerate() {
    setErr("");
    try {
      const d = await api(`/bookings/${bookingId}/regenerate-pin`, {
        method: "POST",
      });
      setPin(String(d.servicePin));
    } catch (e) {
      setErr(e.message);
    }
  }

  const pinDigits = pin.replace(/\D/g, "").split("");

  return (
    <div>
      <p className="text-sm text-slate-500">My Bookings › Security PIN</p>
      <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A]">
        Security Verification
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Verify the worker using this PIN for safety. Share only after they
        arrive at your location.
      </p>

      {worker && (
        <div className="mt-6 flex max-w-md items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          {worker.photo ? (
            <img
              src={worker.photo}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-200" />
          )}
          <div>
            <p className="font-semibold">{worker.name}</p>
            <p className="text-sm text-slate-500">{worker.profession}</p>
            <p className="text-sm">★ {worker.rating}</p>
          </div>
        </div>
      )}

      {err && <p className="mt-4 text-red-600">{err}</p>}
      <div className="mt-10 flex gap-4">
        {(pinDigits.length ? pinDigits : ["•", "•", "•", "•"]).map((ch, i) => (
          <div
            key={i}
            className="flex h-20 w-16 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-3xl font-bold text-[#1E3A8A] shadow-sm"
          >
            {ch}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/client/tracking"
          className="rounded-xl bg-[#1E3A8A] px-8 py-4 text-sm font-semibold text-white shadow-md"
        >
          Track Worker
        </Link>
        <button
          type="button"
          onClick={regenerate}
          className="rounded-xl border border-slate-200 px-6 py-4 text-sm font-medium hover:bg-slate-50"
        >
          Regenerate PIN
        </button>
      </div>
    </div>
  );
}
