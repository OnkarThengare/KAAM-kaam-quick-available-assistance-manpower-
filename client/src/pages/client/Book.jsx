import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";

export default function Book() {
  const { id } = useParams();
  const [w, setW] = useState(null);
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("Bengaluru, KA");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api(`/workers/${id}`).then(setW).catch(() => setW(null));
  }, [id]);

  async function confirm() {
    setErr("");
    try {
      const category = sessionStorage.getItem("kaam_service_category") || "";
      const serviceType = sessionStorage.getItem("kaam_service_type") || "";
      const hours = 2;
      const rate = w?.hourlyRate || 350;
      const booking = await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          workerId: id,
          notes,
          address,
          serviceCategory: category,
          serviceType,
          priceEstimate: rate * hours,
        }),
      });
      sessionStorage.setItem("kaam_last_booking_id", booking._id);
      navigate("/client/pin", { state: { booking } });
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!w) return <p className="text-slate-600">Loading…</p>;

  return (
    <div>
      <Link to={`/client/worker/${id}`} className="text-sm text-[#1E3A8A]">
        ← Back
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A]">Confirm Booking</h1>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold">{w.name}</h2>
            <p className="text-sm text-slate-500">{w.profession} · ★ {w.rating}</p>
            <p className="mt-4 font-medium">₹{w.hourlyRate}/hr estimated</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Task notes
            </label>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue…"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-[#1E3A8A] p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">Booking summary</h2>
          <p className="mt-4 text-sm text-blue-100">
            Service fee based on estimated hours & rate.
          </p>
          {err && <p className="mt-4 text-sm text-amber-200">{err}</p>}
          <button
            type="button"
            onClick={confirm}
            className="mt-8 w-full rounded-xl bg-white py-4 text-sm font-bold text-[#1E3A8A]"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
