import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveMap from "../../components/LiveMap";
import { api } from "../../api";

const HUB = [12.9716, 77.5946];

export default function ActiveJob() {
  const [booking, setBooking] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const workerApproach = useMemo(
    () => [HUB[0] - 0.008, HUB[1] - 0.01],
    []
  );
  const [proPos, setProPos] = useState(workerApproach);

  useEffect(() => {
    api("/bookings/worker/active")
      .then(setBooking)
      .catch(() => setBooking(null));
  }, []);

  useEffect(() => {
    if (!booking?.pinVerified) {
      const id = setInterval(() => {
        setProPos(([la, lo]) => {
          const [tla, tlo] = HUB;
          return [la + (tla - la) * 0.1, lo + (tlo - lo) * 0.1];
        });
      }, 2000);
      return () => clearInterval(id);
    }
    setProPos(HUB);
    return undefined;
  }, [booking?.pinVerified]);

  async function verifyPin(e) {
    e.preventDefault();
    if (!booking?._id) return;
    setErr("");
    try {
      await api(`/bookings/${booking._id}/verify-pin`, {
        method: "POST",
        body: JSON.stringify({ pin }),
      });
      const b = await api(`/bookings/worker/active`);
      setBooking(b);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function complete() {
    if (!booking?._id) return;
    setErr("");
    try {
      await api(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });
      navigate("/worker/history");
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!booking) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A]">No active job</h1>
        <p className="mt-2 text-slate-600">
          Accept a job from the job board or wait for a client booking.
        </p>
      </div>
    );
  }

  const client = booking.clientId;

  return (
    <div>
      <p className="text-sm text-slate-500">My Bookings › Active Job</p>
      <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A]">In-Progress Service</h1>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Client</h2>
            <p className="mt-2 text-lg">
              {client?.firstName} {client?.lastName}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {booking.serviceType || booking.notes}
            </p>
            <p className="mt-4 text-xl font-bold text-[#1E3A8A]">
              ₹{booking.priceEstimate || 0}
            </p>
          </div>
          <LiveMap
            height={300}
            clientLatLng={HUB}
            professionalLatLng={proPos}
            showServiceArea={false}
          />
          <p className="text-xs text-slate-500">
            Map shows service vicinity (demo). PIN verified = at location.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#1E3A8A] p-6 text-white">
            <p className="text-sm">● CURRENTLY ACTIVE</p>
            <p className="mt-2 text-2xl font-mono">Status: {booking.status}</p>
          </div>
          {!booking.pinVerified && (
            <form
              onSubmit={verifyPin}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-600">
                Enter the 4-digit PIN from the client to start.
              </p>
              <input
                className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-xl tracking-widest"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-[#1E3A8A] py-3 font-semibold text-white"
              >
                Verify PIN
              </button>
            </form>
          )}
          {booking.pinVerified && (
            <button
              type="button"
              onClick={complete}
              className="w-full rounded-xl bg-[#1E3A8A] py-4 font-semibold text-white"
            >
              Complete Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
