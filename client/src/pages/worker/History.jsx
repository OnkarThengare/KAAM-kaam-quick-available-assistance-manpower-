import { useEffect, useState } from "react";
import { api } from "../../api";

export default function History() {
  const [data, setData] = useState({ bookings: [], totalEarnings: 0 });

  useEffect(() => {
    api("/bookings/worker/history")
      .then(setData)
      .catch(() => setData({ bookings: [], totalEarnings: 0 }));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Work History</h1>
      <p className="mt-4 text-lg font-semibold text-slate-700">
        Total earnings: ₹{data.totalEarnings}
      </p>
      <ul className="mt-8 space-y-3">
        {data.bookings?.map((b) => (
          <li
            key={b._id}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            {b.serviceType || b.notes} — ₹{b.priceEstimate}
          </li>
        ))}
      </ul>
    </div>
  );
}
