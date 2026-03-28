import { useEffect, useState } from "react";
import { api } from "../../api";

export default function Bookings() {
  const [data, setData] = useState({ bookings: [] });

  useEffect(() => {
    api("/bookings").then(setData).catch(() => setData({ bookings: [] }));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">My Bookings</h1>
      <ul className="mt-8 space-y-4">
        {data.bookings?.map((b) => (
          <li
            key={b._id}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <p className="font-medium">
              {b.workerId?.name} — {b.status}
            </p>
            <p className="text-sm text-slate-500">{b.serviceType || b.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
