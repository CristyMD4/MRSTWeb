import { useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";
import { Icon } from "../components/Icons";
import { addMessage, uid, seedIfEmpty } from "../lib/storage";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const CONTACT_DETAILS = [
  {
    icon: "pin",
    titleKey: "contact.location",
    value: "123 Clean Street, Wash City, WC 12345",
  },
  {
    icon: "phone",
    titleKey: "contact.phone",
    value: "(555) 123-4567",
  },
  {
    icon: "mail",
    titleKey: "contact.email",
    value: "info@sparklewash.com",
  },
];

const CONTACT_STATS = [
  { label: "Reply window", value: "2h", detail: "Fast replies during operating hours." },
  { label: "Availability", value: "Daily", detail: "Support for bookings and service questions." },
  { label: "Channels", value: "3", detail: "Phone, email, and direct message form." },
];

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    seedIfEmpty();
    addMessage({
      id: uid("MSG"),
      ...form,
      at: Date.now(),
      read: false,
    });

    alert("Message sent. Open /admin/messages to review it in the demo admin panel.");
    setForm(INITIAL_FORM);
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/50 bg-[#08111e] text-white">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.24),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,15,30,0.94),rgba(8,15,30,0.76))]" />
        <div className="relative">
          <div className="container-page py-16 md:py-20">
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div className="max-w-3xl">
                <div className="badge border-white/15 bg-white/10 text-white">Customer care and support</div>
                <h1 className="mt-5 max-w-[11ch] text-4xl font-extrabold tracking-tight md:text-6xl">
                  <span className="block">Reach the team</span>
                  <span className="mt-1 block">without friction.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                  Ask about booking availability, detailing options, memberships, or business partnerships through a cleaner premium contact experience.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {CONTACT_STATS.map((item, index) => (
                  <div
                    key={item.label}
                    className={`glass-dark sw-tilt-card rounded-[28px] p-5 text-white ${index === 1 ? "sm:-translate-y-3" : ""}`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">{item.label}</div>
                    <div className="mt-4 text-3xl font-extrabold">{item.value}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={t("contact.title")} subtitle={t("contact.subtitle")} className="bg-white/55">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-800 to-[var(--sw-blue)] px-7 py-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Customer Care</p>
              <h3 className="mt-3 text-2xl font-extrabold">Let&apos;s plan your next visit</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                Reach out for wash packages, detailing questions, or business partnerships. Our team is available daily and replies quickly during operating hours.
              </p>
            </div>

            <div className="grid gap-5 p-7">
              {CONTACT_DETAILS.map((item) => (
                <div key={item.titleKey} className="card sw-tilt-card flex items-start gap-4 rounded-2xl border border-slate-200 p-4 shadow-none">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--sw-blue)]">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wide text-slate-500">{t(item.titleKey)}</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">{item.value}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold uppercase tracking-wide text-slate-500">{t("contact.hours")}</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <p>{t("contact.fullHours")}</p>
                  <p>{t("contact.selfHours")}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  title="SparkleWash location map"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=New%20York&output=embed"
                />
              </div>
            </div>
          </div>

          <div className="panel p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-extrabold text-slate-900">{t("contact.send")}</div>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Share a few details and we&apos;ll follow up with the best appointment or service option.
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                Reply within 2 hours
              </div>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="h-12 rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[var(--sw-blue)] focus:ring-4 focus:ring-blue-100"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder={t("contact.placeholders.name")}
                  required
                />
                <input
                  className="h-12 rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[var(--sw-blue)] focus:ring-4 focus:ring-blue-100"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder={t("contact.placeholders.email")}
                  type="email"
                  required
                />
              </div>
              <input
                className="h-12 rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[var(--sw-blue)] focus:ring-4 focus:ring-blue-100"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder={t("contact.placeholders.phone")}
                required
              />
              <textarea
                className="min-h-[160px] rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--sw-blue)] focus:ring-4 focus:ring-blue-100"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder={t("contact.placeholders.message")}
                required
              />
              <button className="btn btn-primary h-12" type="submit">
                {t("contact.sendBtn")}
              </button>
            </form>

            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              Messages are stored in localStorage so the demo admin panel can review them at
              <span className="font-semibold text-slate-700"> /admin/messages</span>.
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
