import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api";

export default function WorkerProfile() {
  const { id } = useParams();
  const [w, setW] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api(`/workers/${id}`)
      .then(setW)
      .catch(() => setW(null));
      api(`/reviews/worker/${id}`)
        .then((d) => setReviews(d.reviews || []))
        .catch(() => setReviews([]));
  }, [id]);

  if (!w) {
    return <p className="text-slate-600">Loading profile…</p>;
  }

  return (
    <div>
      <p className="text-sm text-slate-500">Find Worker › Worker Profile</p>
      <div className="mt-4 grid grid-cols-2 gap-8">
        <div>
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex gap-6">
              {w.photo && (
                <img
                  src={w.photo}
                  alt=""
                  className="h-32 w-32 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{w.name}</h1>
                <p className="text-[#1E3A8A]">{w.profession}</p>
                <p className="mt-2">★ {w.rating}</p>
                <p className="mt-2 text-lg font-semibold">
                  ₹{w.hourlyRate || 350}/hr
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-600">{w.bio}</p>
            <Link
              to={`/client/book/${id}`}
              className="mt-8 block rounded-xl bg-[#1E3A8A] py-3 text-center font-semibold text-white"
            >
              BOOK WORKER
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#1E3A8A]">Reviews</h2>
          <ul className="mt-4 space-y-3">
            {reviews.length === 0 && (
              <li className="text-sm text-slate-500">No reviews yet.</li>
            )}
            {reviews.map((r) => (
              <li key={r._id} className="text-sm">
                {"★".repeat(r.stars)} — {r.comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
