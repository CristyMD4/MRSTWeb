import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";

const PRICING_METRICS = [
  { label: "Entry point", value: "$8", detail: "Simple self-service access for quick cleaning needs." },
  { label: "Popular tier", value: "Express", detail: "Balanced pricing for repeat local customers." },
  { label: "Upsell path", value: "Detailing", detail: "Higher-value premium packages for deeper care." },
];

function Plan({ name, tagline, price, unit, features = [], featured }) {
  return (
    <div className={"card sw-tilt-card relative overflow-hidden p-8 " + (featured ? "ring-2 ring-[var(--sw-blue)] shadow-[0_20px_50px_rgba(29,78,216,0.16)]" : "")}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--sw-blue)] px-4 py-1 text-xs font-extrabold text-white">
          Most Popular
        </div>
      )}
      <div className="text-lg font-extrabold">{name}</div>
      <div className="mt-2 text-sm text-slate-600">{tagline}</div>
      <div className="mt-6 flex items-end gap-2">
        <div className="text-5xl font-extrabold text-slate-900">{price}</div>
        <div className="pb-2 text-sm text-slate-500">{unit}</div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--sw-blue)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/book" className={"btn mt-8 h-11 w-full " + (featured ? "btn-primary" : "btn-outline")}>
        Get Started
      </Link>
    </div>
  );
}

export default function Pricing() {
  const { t } = useTranslation();
  const plans = t("pricing.plans", { returnObjects: true }) || {};

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/50 bg-[#07101d] text-white">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.24),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,15,30,0.94),rgba(8,15,30,0.78))]" />
        <div className="relative">
          <div className="container-page py-16 md:py-20">
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div className="max-w-3xl">
                <div className="badge border-white/15 bg-white/10 text-white">Clear pricing structure</div>
                <h1 className="mt-5 max-w-[11ch] text-4xl font-extrabold tracking-tight md:text-6xl">
                  <span className="block">Pricing that</span>
                  <span className="mt-1 block">feels premium.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                  From simple self-service access to full premium detailing, every tier is structured to feel clear, credible, and easy to compare.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/book" className="btn btn-primary">
                    Reserve a slot
                  </Link>
                  <Link to="/contact" className="btn btn-outline">
                    Ask for custom pricing
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {PRICING_METRICS.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`glass-dark sw-tilt-card rounded-[28px] p-5 text-white ${index === 1 ? "sm:-translate-y-3" : ""}`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">{metric.label}</div>
                    <div className="mt-4 text-3xl font-extrabold">{metric.value}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={t("pricing.title")} subtitle={t("pricing.subtitle")} className="bg-white/55">
        <div className="grid gap-6 lg:grid-cols-3">
          <Plan {...(plans.self || {})} />
          <Plan {...(plans.express || {})} featured />
          <Plan {...(plans.premium || {})} />
        </div>

        <div className="panel sw-reveal-up mt-10 overflow-hidden p-7 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="section-eyebrow">Business Plans</div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                Need fleet packages or monthly service plans?
              </div>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                We can package recurring wash plans, business vehicle maintenance, and higher-volume detailing arrangements into a cleaner custom offer.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="metric-card sw-tilt-card">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Best for teams</div>
                <div className="mt-3 text-2xl font-extrabold text-slate-950">Fleet coverage</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Recurring service schedules for company vehicles and operational fleets.</p>
              </div>
              <div className="metric-card sw-tilt-card">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Best for loyal clients</div>
                <div className="mt-3 text-2xl font-extrabold text-slate-950">Membership plans</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Cleaner monthly offers for frequent drivers who want predictable care.</p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <Link to="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
