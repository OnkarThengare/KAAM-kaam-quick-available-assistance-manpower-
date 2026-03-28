import { Link } from "react-router-dom";
import RouteLabel from "../components/RouteLabel";
import SiteFooter from "../components/SiteFooter";

/** Professional trades / manpower — high-res CDN hero (update URL anytime). */
const heroImg =
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1400&q=88&auto=format&fit=crop";

const trustImg =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";

const serviceCategories = [
  {
    title: "Home repairs",
    desc: "Plumbing, electrical, carpentry, and quick fixes from vetted tradespeople.",
    icon: "🔧",
  },
  {
    title: "Cleaning & care",
    desc: "Deep cleaning, sanitisation, and recurring home maintenance schedules.",
    icon: "✨",
  },
  {
    title: "Moving & logistics",
    desc: "Loading, packing help, and on-demand muscle for shifting day.",
    icon: "📦",
  },
  {
    title: "Outdoor & misc",
    desc: "Gardening, painting touch-ups, appliance help, and custom tasks.",
    icon: "🏡",
  },
];

const stats = [
  { value: "60s", label: "Typical match time" },
  { value: "2k+", label: "Active professionals" },
  { value: "4.8★", label: "Average job rating" },
  { value: "24/7", label: "Concierge support" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
          <span className="text-xl font-bold text-[#1E3A8A]">KAAM</span>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="hover:text-[#1E3A8A]">
              Home
            </a>
            <a href="#about" className="hover:text-[#1E3A8A]">
              About
            </a>
            <a href="#services" className="hover:text-[#1E3A8A]">
              Services
            </a>
            <a href="#contact" className="hover:text-[#1E3A8A]">
              Contact
            </a>
            <a href="#how" className="hover:text-[#1E3A8A]">
              How it Works
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">🌐 EN</span>
            <Link to="/login" className="text-sm font-medium text-[#1E3A8A]">
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white"
            >
              Signup
            </Link>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-8 py-16 lg:grid-cols-2"
      >
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Find Workers Instantly{" "}
            <span className="text-[#F97316]">Near You</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            The premium concierge for everyday tasks. Connect with verified local
            professionals for plumbing, electrical, cleaning, and more — with
            OTP-secured signup, job PIN handoffs, and live maps so you always know
            who is coming and when.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup?role=client"
              className="rounded-xl bg-[#1E3A8A] px-8 py-4 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#172554]"
            >
              I NEED WORKER →
            </Link>
            <Link
              to="/signup?role=worker"
              className="rounded-xl bg-[#F97316] px-8 py-4 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#EA580C]"
            >
              I WANT WORK 💼
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-white bg-slate-300"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              2,000+ professionals online today
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <img
            src={heroImg}
            alt="Licensed technician — KAAM connects you with skilled local professionals"
            className="h-full min-h-[320px] w-full object-cover object-center lg:min-h-[420px]"
            loading="eager"
            decoding="async"
          />
          <div className="absolute bottom-4 left-4 max-w-[220px] rounded-xl bg-white/95 px-4 py-2 text-xs font-semibold leading-snug text-[#1E3A8A] shadow">
            Verified talent · India-wide · Book in minutes
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="text-2xl font-bold text-[#1E3A8A] sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            The hassle of traditional hiring
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Phone calls, uncertain pricing, and no-shows waste your time. KAAM
            centralises discovery, booking, verification, and payment readiness in
            one flow — so homeowners get clarity and workers get fair, structured
            jobs.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-2">
                <span className="text-red-500">✗</span>
                Endless phone tag and WhatsApp groups
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✗</span>
                Hidden fees and unclear scope
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✗</span>
                Security risks without verified identities
              </li>
            </ul>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-6 text-slate-700">
                64% of homeowners struggle to find reliable repair services on
                short notice — KAAM is built to shorten that gap.
              </div>
              <div className="rounded-2xl bg-[#1E3A8A] p-6 text-white">
                Zero wait time with KAAM — browse profiles, book a slot, share a
                PIN at the door, and track the visit on the map.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Popular service categories
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Pick a category in the app to see worker availability, skills, and
            ratings. Every booking supports notes, scheduling, and post-job
            reviews.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1E3A8A]/30 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden>
                  {c.icon}
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.desc}
                </p>
                <Link
                  to="/signup?role=client"
                  className="mt-4 inline-block text-sm font-semibold text-[#F97316] hover:underline"
                >
                  Book this type →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="border-t border-slate-200 bg-[#eff6ff] py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Trust, safety, and transparency
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">Verified access</h3>
              <p className="mt-2 text-sm text-slate-600">
                Email OTP verification on signup, role-based dashboards for
                clients and workers, and JWT-secured API sessions.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">PIN at the door</h3>
              <p className="mt-2 text-sm text-slate-600">
                Share a short PIN so the right worker completes the job. Status
                updates from requested → in progress → completed.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">Reviews that matter</h3>
              <p className="mt-2 text-sm text-slate-600">
                After completion, rate the experience so the community stays
                high-quality and workers build a real reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" id="how">
        <div className="mx-auto max-w-[1440px] px-8">
          <h2 className="text-3xl font-bold text-[#1E3A8A]">
            Designed for trust and speed
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#1E3A8A] p-8 text-white lg:col-span-2">
              <img
                src={trustImg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="relative z-10">
                <p className="text-xl font-semibold">Real-time geolocation</p>
                <p className="mt-2 max-w-md text-sm text-blue-100">
                  Live maps powered by OpenStreetMap — see professionals approach
                  your location after you confirm a booking.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-900">Verified professionals</p>
                <p className="mt-2 text-sm text-slate-600">
                  Profiles with skills, areas served, and transparent ratings from
                  past jobs.
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="font-semibold text-slate-900">Structured bookings</p>
                <p className="mt-2 text-sm text-slate-600">
                  Clear job cards for workers; history and receipts for clients.
                </p>
              </div>
              <div className="rounded-2xl bg-[#F97316] p-6 text-white">
                <p className="font-semibold">Concierge support</p>
                <p className="mt-2 text-sm text-white/90">
                  Help when matching, rescheduling, or disputing a visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1E3A8A] py-12 text-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-8 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-6">
            <h3 className="font-bold">1. Post a task</h3>
            <p className="mt-2 text-sm text-blue-100">
              Sign up, verify your email, and describe what you need — category,
              time window, and location.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-6">
            <h3 className="font-bold">2. Match instantly</h3>
            <p className="mt-2 text-sm text-blue-100">
              Compare workers, book, and receive a PIN. Track status as the job
              moves to active.
            </p>
          </div>
          <div className="rounded-xl bg-[#F97316] p-6">
            <h3 className="font-bold">3. Done & dusted</h3>
            <p className="mt-2 text-sm text-white/90">
              Confirm completion, leave a review, and build trust for next time.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Get in touch</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Whether you are a homeowner, property manager, or skilled tradesperson,
            we would love to hear from you. For partnerships and press, use the
            same channel — our concierge team routes every message.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Head office</p>
              <p className="mt-2 text-sm text-slate-600">
                KAAM Concierge Hub
                <br />
                Bengaluru, Karnataka, India
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Support</p>
              <p className="mt-2 text-sm text-slate-600">
                <a
                  href="mailto:support@kaam.app"
                  className="font-medium text-[#1E3A8A] hover:underline"
                >
                  support@kaam.app
                </a>
                <br />
                Mon–Sat, 9:00–20:00 IST
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <RouteLabel path="/" />
    </div>
  );
}
