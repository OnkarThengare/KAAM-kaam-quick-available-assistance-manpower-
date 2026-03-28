import { useEffect, useState } from "react";
import { api } from "../../api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api("/jobs")
      .then((d) => setJobs(d.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Available Job Requests</h1>
      <p className="mt-2 text-slate-600">Accept jobs that match your trade.</p>
      <div className="mt-10 space-y-4">
        {jobs.map((j) => (
          <JobRow key={j._id} job={j} />
        ))}
        {jobs.length === 0 && (
          <p className="text-slate-500">No open jobs. Run server seed.</p>
        )}
      </div>
    </div>
  );
}

function JobRow({ job }) {
  const [msg, setMsg] = useState("");

  async function accept() {
    setMsg("");
    try {
      await api(`/jobs/${job._id}/accept`, { method: "POST" });
      window.location.href = "/worker/active-job";
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div>
        <p className="font-semibold">{job.title}</p>
        <p className="text-sm text-slate-500">
          {job.service} · {job.distanceKm} km · ₹{job.price}
        </p>
        <p className="mt-2 text-sm text-slate-600">{job.description}</p>
        {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white"
        >
          Accept
        </button>
        <span className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
          Decline
        </span>
      </div>
    </div>
  );
}
