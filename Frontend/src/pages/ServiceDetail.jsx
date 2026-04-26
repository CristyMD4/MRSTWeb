import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Section from "../components/Section";
import { Icon } from "../components/Icons";
import AvailabilityWidget from "../components/AvailabilityWidget";

const SERVICES = {
  "full-service": {
    icon: "sparkle",
    title: "Full-Service Wash",
    tagline: "Complete care, handled by our professional team.",
    description:
      "Our Full-Service Wash is the most comprehensive exterior and interior cleaning option we offer. Your car is hand-washed by trained staff using premium products, leaving every surface spotless — from the wheels to the windows.",
    price: "$25",
    duration: "~45 min",
    included: [
      "Hand wash of the entire exterior",
      "High-pressure pre-rinse to remove loose dirt",
      "Wheel & tire scrub and shine",
      "Window cleaning inside and out",
      "Interior vacuum (seats, floor mats, trunk)",
      "Dashboard and console wipe-down",
      "Air freshener finish",
      "Spot-free rinse and hand dry",
    ],
    steps: [
      { icon: "drop", title: "Pre-rinse", desc: "High-pressure water removes loose dirt and debris before washing begins." },
      { icon: "sparkle", title: "Hand Wash", desc: "Our team hand-washes the entire exterior with pH-balanced, eco-friendly soap." },
      { icon: "wand", title: "Detail & Dry", desc: "Windows, wheels, and surfaces are detailed and dried with microfiber towels." },
      { icon: "shield", title: "Final Check", desc: "A staff member does a quality walk-around before returning your keys." },
    ],
    faq: [
      { q: "Do I need an appointment?", a: "Walk-ins are welcome, but booking in advance guarantees your preferred time slot." },
      { q: "How long does it take?", a: "Most full-service washes are completed in 30–45 minutes depending on vehicle size." },
      { q: "Is it safe for my paint?", a: "Yes. We use soft microfiber materials and gentle, pH-neutral soaps that won't damage your finish." },
    ],
  },
  "self-service": {
    icon: "drop",
    title: "Self-Service Wash",
    tagline: "Wash your car your way, on your schedule.",
    description:
      "Our self-service bays are open 24/7 and equipped with professional-grade equipment so you can wash your vehicle whenever it suits you. Pay per use, no appointment needed.",
    price: "$8",
    duration: "No time limit",
    included: [
      "High-pressure wash gun",
      "Foam cannon applicator",
      "Wheel & tire brush",
      "Spot-free rinse cycle",
      "Vacuum stations (free)",
      "Mat cleaning station",
      "Fragrance & vending machine",
      "Lit, monitored bays",
    ],
    steps: [
      { icon: "clock", title: "Arrive & Pay", desc: "Choose a free bay, pay at the kiosk with card or cash, and begin your wash." },
      { icon: "drop", title: "Pre-soak & Foam", desc: "Apply the pre-soak, then foam cannon to lift dirt from the surface safely." },
      { icon: "sparkle", title: "Rinse & Vacuum", desc: "Rinse off all foam thoroughly, then use the free vacuum stations for the interior." },
      { icon: "shield", title: "Spot-free Finish", desc: "End with a spot-free rinse cycle for a streak-free, shiny finish." },
    ],
    faq: [
      { q: "What are your hours?", a: "Self-service bays are open 24 hours a day, 7 days a week, including holidays." },
      { q: "How much does it cost?", a: "Starting at $8 per session. Additional time tokens available at the kiosk." },
      { q: "Are the vacuums included?", a: "Yes, vacuum stations are free with every paid bay session." },
    ],
  },
  "premium-detailing": {
    icon: "wand",
    title: "Premium Detailing",
    tagline: "Showroom finish. Every time.",
    description:
      "Our Premium Detailing service goes far beyond a standard wash. We restore your vehicle's exterior shine and deep-clean every inch of the interior — leaving it looking and smelling like new.",
    price: "$89",
    duration: "2–3 hours",
    included: [
      "Full exterior hand wash & dry",
      "Clay bar treatment (removes bonded contaminants)",
      "Machine polish & wax",
      "Headlight restoration",
      "Engine bay cleaning",
      "Full interior vacuum & shampoo",
      "Leather conditioning",
      "Plastic trim restoration",
      "Glass polish inside and out",
      "Tyre dressing & rim detailing",
    ],
    steps: [
      { icon: "drop", title: "Wash & Decontaminate", desc: "Full exterior wash followed by clay bar treatment to remove embedded contaminants." },
      { icon: "sparkle", title: "Polish & Protect", desc: "Machine polishing corrects minor scratches and swirl marks. Wax seals the finish." },
      { icon: "wand", title: "Interior Deep Clean", desc: "All surfaces, fabrics, leather, and plastics are cleaned, conditioned, and treated." },
      { icon: "shield", title: "Final Inspection", desc: "We inspect every panel and surface under proper lighting before delivery." },
    ],
    faq: [
      { q: "Should I book in advance?", a: "Yes — detailing slots fill up quickly. We recommend booking at least 48 hours ahead." },
      { q: "How long will the wax last?", a: "Our carnauba wax typically protects for 4–6 weeks. Ask about ceramic coating for longer protection." },
      { q: "Can you remove deep scratches?", a: "We can correct light-to-medium scratches and swirl marks. Deep scratches may require bodywork." },
    ],
  },
  "interior-cleaning": {
    icon: "sparkle",
    title: "Interior Cleaning",
    tagline: "A fresh, spotless cabin every time.",
    description:
      "Our dedicated Interior Cleaning service focuses entirely on the inside of your vehicle. Perfect for families, pet owners, or anyone who wants a deep refresh without a full detail.",
    price: "$45",
    duration: "~1.5 hours",
    included: [
      "Full vacuum — seats, floor, boot",
      "Seat and carpet shampoo",
      "Dashboard, console & door panel wipe-down",
      "Air vent cleaning",
      "Window interior polish",
      "Odour elimination treatment",
      "Floor mat deep clean",
      "Child seat wipe-down (if applicable)",
    ],
    steps: [
      { icon: "sparkle", title: "Remove & Vacuum", desc: "Floor mats are removed and every surface is thoroughly vacuumed." },
      { icon: "drop", title: "Shampoo", desc: "Seats and carpets are shampooed with our fabric-safe, deep-clean formula." },
      { icon: "wand", title: "Wipe & Polish", desc: "Hard surfaces, vents, windows, and trims are wiped and polished." },
      { icon: "shield", title: "Odour Treatment", desc: "We finish with an odour-neutralising treatment for a truly fresh result." },
    ],
    faq: [
      { q: "Is shampooing safe for leather seats?", a: "We use dedicated leather-safe products and condition the seats after cleaning." },
      { q: "How long until the interior is dry?", a: "Typically 1–2 hours after the service. We recommend leaving windows slightly open." },
      { q: "Do you remove pet hair?", a: "Yes. We use specialist tools to lift embedded pet hair from all fabric surfaces." },
    ],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const svc = SERVICES[slug];

  if (!svc) return <Navigate to="/services" replace />;

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container-page">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-[var(--sw-blue)] hover:underline mb-6">
            ← Back to Services
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-md text-[var(--sw-blue)] flex items-center justify-center flex-shrink-0">
              <Icon name={svc.icon} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{svc.title}</h1>
              <p className="mt-2 text-lg text-slate-500">{svc.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-[var(--sw-blue)]">
                  From {svc.price}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-600">
                  {svc.duration}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-slate-600 leading-8 text-base">{svc.description}</p>
          <div className="mt-8">
            <Link to="/book" className="btn btn-primary">Book This Service</Link>
          </div>
        </div>
      </section>

      {/* Disponibilitate în timp real — doar pentru self-service */}
      {slug === "self-service" && (
        <Section title="Disponibilitate în timp real">
          <p className="text-center text-slate-500 text-sm -mt-6 mb-6">
            Boxurile marcate cu <span className="font-semibold text-emerald-600">✓</span> sunt libere acum.
            Se actualizează automat la 30 de secunde.
          </p>
          <AvailabilityWidget />
        </Section>
      )}

      {/* What's Included */}
      <Section title="What's Included">
        <div className="grid gap-3 sm:grid-cols-2">
          {svc.included.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--sw-blue)]" />
              <span className="text-slate-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section title="How It Works" className="bg-slate-50">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {svc.steps.map((step, i) => (
            <div key={step.title} className="card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center mb-4">
                <Icon name={step.icon} className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Step {i + 1}</div>
              <div className="font-extrabold text-slate-900">{step.title}</div>
              <p className="mt-2 text-sm text-slate-600 leading-6">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions">
        <div className="max-w-2xl mx-auto grid gap-4">
          {svc.faq.map((item) => (
            <div key={item.q} className="card p-6">
              <div className="font-extrabold text-slate-900">{item.q}</div>
              <p className="mt-2 text-slate-600 text-sm leading-6">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA — ascuns pentru self-service (nu se fac programări) */}
      {slug !== "self-service" && (
        <section className="py-16 bg-[var(--sw-blue)]">
          <div className="container-page text-center">
            <h2 className="text-3xl font-black text-white">Ready to book?</h2>
            <p className="mt-3 text-blue-100">Schedule your {svc.title} appointment in minutes.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/book" className="btn bg-white text-[var(--sw-blue)] hover:bg-blue-50 font-bold px-8">Book Now</Link>
              <Link to="/contact" className="btn border border-white/40 text-white hover:bg-white/10 px-8">Contact Us</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
