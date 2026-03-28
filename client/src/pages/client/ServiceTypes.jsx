import { Link, useParams } from "react-router-dom";

const TYPES = {
  electrician: [
    "Fan Repair",
    "AC Repair",
    "Fridge",
    "Geyser",
    "Cooler",
    "Other",
  ],
  plumber: ["Leak", "Tap", "Bathroom", "Motor", "Other"],
  cleaner: ["Deep clean", "Regular", "Office", "Other"],
  carpenter: ["Furniture", "Door", "Shelf", "Other"],
  painter: ["Interior", "Exterior", "Touch-up", "Other"],
  driver: ["Local", "Outstation", "Hourly", "Other"],
};

export default function ServiceTypes() {
  const { category } = useParams();
  const types = TYPES[category] || ["General service"];

  function onPick(type) {
    sessionStorage.setItem("kaam_service_category", category || "");
    sessionStorage.setItem("kaam_service_type", type);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold capitalize text-[#1E3A8A]">
        {category} — select service
      </h1>
      <p className="mt-2 text-slate-600">Pick a specific job type.</p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {types.map((t) => (
          <Link
            key={t}
            to="/client/workers"
            onClick={() => onPick(t)}
            className="rounded-xl border border-slate-200 bg-white p-6 text-center font-medium shadow-sm hover:border-[#1E3A8A]"
          >
            {t}
          </Link>
        ))}
      </div>

    </div>
  );
}
