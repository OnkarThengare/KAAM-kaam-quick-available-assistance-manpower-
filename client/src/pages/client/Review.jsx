import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

export default function Review() {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const bookingId = sessionStorage.getItem("kaam_last_booking_id");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!bookingId) {
      setErr("No booking context");
      return;
    }
    try {
      await api(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      });
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({ bookingId, stars, comment }),
      });
      navigate("/client/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Rate your service</h1>
      <form onSubmit={submit} className="mt-8 max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium">Stars</label>
          <input
            type="range"
            min={1}
            max={5}
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <p>{stars} / 5</p>
        </div>
        <textarea
          className="w-full rounded-lg border border-slate-200 p-3 text-sm"
          rows={4}
          placeholder="Feedback…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          className="rounded-xl bg-[#1E3A8A] px-8 py-3 font-semibold text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
