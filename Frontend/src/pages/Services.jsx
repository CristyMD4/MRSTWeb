import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";
import { Icon } from "../components/Icons";

const SERVICES = [
  {
    slug: "full-service",
    icon: "sparkle",
    price: "$25",
    key: "full",
    title: "Full-Service Wash",
    desc: "Complete exterior and interior cleaning by our professional team.",
    duration: "35 min",
    focus: "Exterior + interior",
  },
  {
    slug: "self-service",
    icon: "drop",
    price: "$8",
    key: "self",
    title: "Self-Service Wash",
    desc: "24/7 bays with high-pressure washers, foam cannon, and free vacuums.",
    duration: "Open daily",
    focus: "Quick individual use",
  },
  {
    slug: "premium-detailing",
    icon: "wand",
    price: "$89",
    key: "detail",
    title: "Premium Detailing",
    desc: "Deep restoration, paint enhancement, interior shampoo, and premium finishing.",
    duration: "2-4 hours",
    focus: "Deep care package",
  },
  {
    slug: "interior-cleaning",
    icon: "sparkle",
    price: "$45",
    key: "interior",
    title: "Interior Cleaning",
    desc: "Full vacuum, carpet shampoo, odour treatment, and surface polish.",
    duration: "60 min",
    focus: "Cabin refresh",
  },
];

const SERVICE_PILLARS = [
  { label: "Fast intake", value: "2 min", detail: "Quick booking and service confirmation." },
  { label: "Coverage", value: "7 days", detail: "Daily operational schedule for drivers." },
  { label: "Quality score", value: "4.9/5", detail: "Consistent premium-service feedback." },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/50 bg-[#091323] text-white">
        <div className="absolute inset-0 hero-grid opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,15,30,0.95),rgba(8,15,30,0.72))]" />
        <div className="relative">
          <div className="container-page py-16 md:py-20">
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div className="max-w-3xl">
                <div className="badge border-white/15 bg-white/10 text-white">Professional service lineup</div>
                <h1 className="mt-5 max-w-[11ch] text-4xl font-extrabold tracking-tight md:text-6xl">
                  <span className="block">Premium care</span>
                  <span className="mt-1 block">for every visit.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                  Choose from quick washes, interior refresh packages, or full detailing workflows designed to feel organized, premium, and easy to book.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/book" className="btn btn-primary">
                    Book a service
                  </Link>
                  <Link to="/pricing" className="btn btn-outline">
                    Compare pricing
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {SERVICE_PILLARS.map((pillar, index) => (
                  <div
                    key={pillar.label}
                    className={`glass-dark sw-tilt-card rounded-[28px] p-5 text-white ${index === 1 ? "sm:-translate-y-3" : ""}`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">{pillar.label}</div>
                    <div className="mt-4 text-3xl font-extrabold">{pillar.value}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{pillar.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={t("services.title")} subtitle={t("services.subtitle")} className="bg-white/55">
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map((svc, index) => (
            <div key={svc.slug} className="card sw-tilt-card sw-reveal-up flex flex-col overflow-hidden p-0">
              <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                      <Icon name={svc.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-extrabold">{svc.title}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">
                        From {svc.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-white/10">{String(index + 1).padStart(2, "0")}</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-7 text-slate-600">{svc.desc}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Duration</div>
                    <div className="mt-2 font-extrabold text-slate-900">{svc.duration}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Best for</div>
                    <div className="mt-2 font-extrabold text-slate-900">{svc.focus}</div>
                  </div>
                </div>

                <Link
                  to={`/services/${svc.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--sw-blue)] transition hover:gap-3"
                >
                  See full details
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/book" className="btn btn-primary px-8">
            Book Now
          </Link>
        </div>
      </Section>
    </div>
  );
}
