import { useEffect, useState } from "react";
import { api } from "../../api";

export default function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [add, setAdd] = useState("");
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    profession: "",
    location: "",
    phone: "",
    bio: "",
    hourlyRate: "",
    available: true,
  });

  function applyProfile(p) {
    if (!p) return;
    setForm({
      name: p.name || "",
      profession: p.profession || "",
      location: p.location || "",
      phone: p.phone || "",
      bio: p.bio || "",
      hourlyRate: p.hourlyRate != null ? String(p.hourlyRate) : "",
      available: p.available !== false,
    });
  }

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await api("/workers/me/profile");
      setProfile(data);
      applyProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveDetails(e) {
    e.preventDefault();
    if (!profile?._id) return;
    setErr("");
    setSaved(false);
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        profession: form.profession.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        hourlyRate: Number(form.hourlyRate) || 0,
        available: form.available,
      };
      const updated = await api(`/workers/${profile._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setProfile(updated);
      applyProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function addProfession(e) {
    e.preventDefault();
    setErr("");
    try {
      await api("/workers/me/professions", {
        method: "POST",
        body: JSON.stringify({ profession: add }),
      });
      setAdd("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Worker Profile</h1>
        <p className="mt-4 text-slate-600">Loading your profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Worker Profile</h1>
        <p className="mt-4 text-slate-600">
          We couldn&apos;t load a worker profile. Open this page again — one is
          created automatically when you sign in as a worker.
        </p>
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Worker Profile</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your public details for clients. Update anytime — changes save to your
        account.
      </p>

      <form
        onSubmit={saveDetails}
        className="mt-8 space-y-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Display name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Primary service
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
              placeholder="e.g. Electrician"
              value={form.profession}
              onChange={(e) =>
                setForm((f) => ({ ...f, profession: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Location / area
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
              placeholder="City or neighborhood"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Phone
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Hourly rate (₹)
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
              value={form.hourlyRate}
              onChange={(e) =>
                setForm((f) => ({ ...f, hourlyRate: e.target.value }))
              }
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  setForm((f) => ({ ...f, available: e.target.checked }))
                }
                className="rounded border-slate-300"
              />
              Available for new jobs
            </label>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Bio
          </label>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
            placeholder="Short introduction for clients"
            value={form.bio}
            onChange={(e) =>
              setForm((f) => ({ ...f, bio: e.target.value }))
            }
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {saved && (
          <p className="text-sm font-medium text-emerald-600">Profile saved.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#172554] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="font-semibold text-slate-900">Skills &amp; professions</p>
        <p className="mt-1 text-sm text-slate-600">
          Add tags (e.g. Plumbing, AC repair) shown on your listing.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {(profile.professions || []).map((p) => (
            <li
              key={p}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm text-[#1E3A8A]"
            >
              {p}
            </li>
          ))}
        </ul>
        <form onSubmit={addProfession} className="mt-6 flex flex-wrap gap-2">
          <input
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E3A8A]"
            placeholder="Add profession e.g. Electrician"
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-[#F97316] px-4 py-2 text-sm font-semibold text-white"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}