import { Link } from "react-router-dom";

const categories = [
  [
    "electrician",
    "Electrician",
    "Wiring, AC, appliances",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80",
  ],
  [
    "plumber",
    "Plumber",
    "Leaks, sanitation, fittings",
    "https://images.unsplash.com/photo-1585704031110-7c2b46b08c92?w=600&q=80",
  ],
  [
    "cleaner",
    "Cleaner",
    "Home & office cleaning",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
  ],
  [
    "carpenter",
    "Carpenter",
    "Woodwork & repairs",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80",
  ],
  [
    "painter",
    "Painter",
    "Interior & exterior paint",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
  ],
  [
    "driver",
    "Driver",
    "Local & hourly hire",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
  ],
];

export default function Services() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A]">Service Categories</h1>
      <p className="mt-2 text-slate-600">
        Choose a category to browse vetted professionals.
      </p>
      <div className="mt-10 grid grid-cols-3 gap-6">
        {categories.map(([slug, title, desc, img]) => (
          <Link
            key={slug}
            to={`/client/services/${slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                View
              </span>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
