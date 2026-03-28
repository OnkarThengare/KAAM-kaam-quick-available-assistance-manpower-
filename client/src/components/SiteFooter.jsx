import { Link } from "react-router-dom";

function FooterLink({ label, to, href }) {
  const className = "text-slate-400 transition hover:text-white";
  if (to) return <Link to={to} className={className}>{label}</Link>;
  return (
    <a href={href || "#"} className={className}>
      {label}
    </a>
  );
}

const cols = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "For clients", to: "/signup?role=client" },
      { label: "For workers", to: "/signup?role=worker" },
      { label: "Login", to: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About KAAM", href: "/#about" },
      { label: "Trust & safety", href: "/#trust" },
      { label: "Popular services", href: "/#services" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Cookie notice", href: "#" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-[1440px] px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-xl font-bold text-white">KAAM</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Quick Available Assistance Manpower — connect with verified local
              professionals for home and on-site services, with live tracking
              and secure bookings.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Concierge-grade matching
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {c.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {c.links.map((item) => (
                  <li key={item.label}>
                    <FooterLink {...item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-slate-800 pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Concierge support</p>
            <p className="mt-1 text-sm text-slate-400">
              Email:{" "}
              <a
                href="mailto:support@kaam.app"
                className="text-[#93C5FD] hover:underline"
              >
                support@kaam.app
              </a>
            </p>
            <p className="mt-1 text-sm text-slate-400">
              KAAM Hub · Mon–Sat, 9:00–20:00 IST
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="rounded-full border border-slate-700 px-4 py-2 text-slate-400">
              🔒 Encrypted auth &amp; OTP
            </span>
            <span className="rounded-full border border-slate-700 px-4 py-2 text-slate-400">
              📍 Real-time job tracking
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} KAAM. All rights reserved.</span>
          <span className="max-w-md sm:text-right">
            Built for reliability: MongoDB-backed API, verified workers, and
            PIN-secured handoffs.
          </span>
        </div>
      </div>
    </footer>
  );
}
