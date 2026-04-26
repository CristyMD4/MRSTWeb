import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section";
import BeforeAfterCarousel from "../components/BeforeAfterCarousel";
import { Icon } from "../components/Icons";
import { listProducts } from "../lib/shopStorage";
import { useCart } from "../context/CartContext";

const OPERATIONS_METRICS = [
  { label: "Fulfillment", value: "24h", detail: "Average response time for online enquiries and booking follow-up." },
  { label: "Retention", value: "78%", detail: "Returning customers across wash, detailing, and product orders." },
  { label: "Capacity", value: "42", detail: "Weekly premium-detailing slots managed through the booking flow." },
  { label: "Quality", value: "4.9/5", detail: "Average satisfaction score across recent client feedback." },
];

const WORKFLOW_STEPS = [
  { icon: "calendar", title: "Book the right service", description: "Customers choose a package, preferred day, and add-on services in one clean flow." },
  { icon: "eye", title: "Prepare the vehicle plan", description: "The team reviews requirements, confirms timing, and aligns labor with service complexity." },
  { icon: "sparkle", title: "Execute with premium products", description: "Every wash and detailing task follows a repeatable, quality-controlled process." },
  { icon: "thumb", title: "Track loyalty and re-book", description: "Clients return through their account area, check bookings, and purchase products online." },
];

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="card sw-tilt-card sw-reveal-up p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--sw-blue)]">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

function Plan({ name, tagline, price, unit, features = [], featured = false }) {
  return (
    <div className={"card sw-tilt-card sw-reveal-up relative p-8 " + (featured ? "ring-2 ring-[var(--sw-blue)]" : "")}>
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

const PRODUCT_ART = {
  "foam-shampoo": "Foam",
  "pre-wash-spray": "Prep",
  "wheel-cleaner": "Wheel",
  "wash-mitt": "Mitt",
  "microfiber-set": "Micro",
  "snow-foam-lance": "Lance",
  "bucket-set": "Bucket",
  "drying-aid": "Dry",
  "car-wax": "Wax",
  "quick-detailer": "Quick",
  "leather-conditioner": "Leather",
  "interior-dressing": "Interior",
  "glass-cleaner": "Glass",
  "paint-sealant": "Seal",
  "tire-dressing": "Tire",
  "air-freshener": "Fresh",
  "clay-bar": "Clay",
};

function ShopPreviewCard({ product, onAdd, added }) {
  return (
    <div className="card sw-tilt-card flex h-full flex-col p-5">
      <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-100 text-lg font-black uppercase tracking-[0.2em] text-[var(--sw-blue)]">
        {PRODUCT_ART[product.id] || "Care"}
      </div>
      {product.badge && (
        <span
          className={`mb-2 self-start rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            product.badge === "Best Seller"
              ? "bg-amber-100 text-amber-700"
              : product.badge === "New"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
          }`}
        >
          {product.badge}
        </span>
      )}
      <div className="text-sm font-extrabold leading-tight text-slate-900">{product.name}</div>
      <div className="mt-1 text-[11px] text-slate-400">{product.category}</div>
      <div className="mt-2 text-lg font-black text-[var(--sw-blue)]">${product.price.toFixed(2)}</div>
      <p className="mt-2 flex-1 text-xs leading-5 text-slate-500 line-clamp-2">{product.description}</p>
      <button
        onClick={() => onAdd(product.id)}
        className={`mt-4 h-9 w-full rounded-xl text-xs font-bold transition ${
          added ? "bg-emerald-500 text-white" : "bg-[var(--sw-blue)] text-white hover:bg-blue-600"
        }`}
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}

function ShopPreviewSlider({ products, onAdd, addedIds }) {
  const trackRef = React.useRef(null);
  const [activePage, setActivePage] = React.useState(0);
  const [itemsPerView, setItemsPerView] = React.useState(1);

  React.useEffect(() => {
    const syncItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
        return;
      }
      if (window.innerWidth >= 640) {
        setItemsPerView(2);
        return;
      }
      setItemsPerView(1);
    };

    syncItemsPerView();
    window.addEventListener("resize", syncItemsPerView);
    return () => window.removeEventListener("resize", syncItemsPerView);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerView));

  const scrollToPage = (page) => {
    const track = trackRef.current;
    if (!track) return;

    const nextPage = Math.max(0, Math.min(page, totalPages - 1));
    const nextIndex = nextPage * itemsPerView;
    const card = track.children[nextIndex];
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActivePage(nextPage);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    const closestIndex = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;

    setActivePage(Math.floor(closestIndex / itemsPerView));
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-slate-500">Featured Store Picks</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToPage(activePage - 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Previous products"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => scrollToPage(activePage + 1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Next products"
          >
            &gt;
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[85%] snap-start sm:min-w-[48%] lg:min-w-[24%]">
            <ShopPreviewCard product={product} onAdd={onAdd} added={!!addedIds[product.id]} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToPage(index)}
            className={
              "h-2.5 rounded-full transition " +
              (index === activePage ? "w-8 bg-[var(--sw-blue)]" : "w-2.5 bg-slate-300 hover:bg-slate-400")
            }
            aria-label={`Go to product page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
  return (
    <div className="card sw-tilt-card p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--sw-blue)]">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

function Testimonial({ name, role, text }) {
  return (
    <div className="card sw-tilt-card p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-extrabold text-[var(--sw-blue)]">
          {name[0]}
        </div>
        <div>
          <div className="font-extrabold">{name}</div>
          <div className="text-sm text-slate-500">{role}</div>
        </div>
      </div>
      <p className="mt-5 leading-7 text-slate-700">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState({});
  const rawHeroTitle = t("hero.title");

  const heroTitleParts = React.useMemo(() => {
    if (rawHeroTitle.includes("&")) {
      const [left, right] = rawHeroTitle.split("&");
      return [left.trim(), `& ${right.trim()}`];
    }

    if (rawHeroTitle.includes("\n")) {
      return rawHeroTitle
        .split("\n")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2);
    }

    const words = rawHeroTitle.trim().split(/\s+/);
    const middle = Math.ceil(words.length / 2);
    return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
  }, [rawHeroTitle]);

  const svc = t("services.cards", { returnObjects: true }) || {};
  const plans = t("pricing.plans", { returnObjects: true }) || {};
  const why = t("why.items", { returnObjects: true }) || {};
  const testimonialsRaw = t("testimonials.cards", { returnObjects: true });
  const testimonials = Array.isArray(testimonialsRaw) ? testimonialsRaw : [];

  const featuredProducts = React.useMemo(() => {
    const all = listProducts();
    const badged = all.filter((product) => product.badge);
    const rest = all.filter((product) => !product.badge);
    return [...badged, ...rest].slice(0, 8);
  }, []);

  const featuredCategories = React.useMemo(() => {
    return Array.from(new Set(featuredProducts.map((product) => product.category))).slice(0, 3);
  }, [featuredProducts]);

  const handleAdd = (id) => {
    addToCart(id);
    setAddedIds((previous) => ({ ...previous, [id]: true }));
    setTimeout(() => setAddedIds((previous) => ({ ...previous, [id]: false })), 1500);
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/40 bg-[#07111f]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(15,23,42,0.86), rgba(15,23,42,0.48)), url(https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.3),transparent_28%)]" />
        <div className="relative">
          <div className="container-page py-16 md:py-22 xl:py-24">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] xl:items-start">
              <div className="max-w-3xl xl:pt-10">
                <div className="badge sw-reveal-up border-white/20 bg-white/12 text-white">Trusted by 2,000+ local drivers</div>
                <h1 className="sw-reveal-up-delay-1 mt-5 max-w-[12ch] text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                  <span className="block">{heroTitleParts[0]}</span>
                  {heroTitleParts[1] ? <span className="mt-1 block">{heroTitleParts[1]}</span> : null}
                </h1>
                <p className="sw-reveal-up-delay-2 mt-5 max-w-xl text-lg leading-8 text-white/82">{t("hero.subtitle")}</p>

                <div className="sw-reveal-up-delay-2 mt-9 flex flex-wrap gap-4">
                  <Link to="/book" className="btn btn-primary">{t("hero.cta1")}</Link>
                  <Link to="/services" className="btn btn-outline">{t("hero.cta2")}</Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="sw-tilt-card sw-float rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <div className="text-2xl font-extrabold text-white">4.9/5</div>
                    <div className="mt-1 text-sm text-white/75">Average customer rating</div>
                  </div>
                  <div className="sw-tilt-card sw-float-delay rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <div className="text-2xl font-extrabold text-white">7 Days</div>
                    <div className="mt-1 text-sm text-white/75">Weekly service coverage</div>
                  </div>
                  <div className="sw-tilt-card sw-pulse-soft rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                    <div className="text-2xl font-extrabold text-white">Eco Safe</div>
                    <div className="mt-1 text-sm text-white/75">Premium products, cleaner finish</div>
                  </div>
                </div>
              </div>

              <div className="sw-tilt-card xl:ml-auto xl:mt-6 xl:max-w-[520px] overflow-hidden rounded-[32px] border border-white/12 bg-slate-950/52 text-white shadow-[0_24px_70px_rgba(2,6,23,0.38)] backdrop-blur-xl">
                <div className="grid gap-4 p-5 md:p-6">
                  <div className="rounded-[28px] border border-white/10 bg-white/6">
                    <div className="border-b border-white/10 px-5 py-4">
                      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200/80">Performance grid</div>
                      <div className="mt-2 max-w-[16ch] text-[1.75rem] font-extrabold leading-tight">Premium car care with measurable execution.</div>
                    </div>
                    <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                      {OPERATIONS_METRICS.map((metric) => (
                        <div key={metric.label} className="glass-dark rounded-[24px] p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{metric.label}</div>
                          <div className="mt-2 text-3xl font-extrabold text-white">{metric.value}</div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{metric.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-12 bg-gradient-to-b from-transparent to-[#f5f7fb]" />
        </div>
      </section>

      <Section title={t("services.title")} subtitle={t("services.subtitle")}>
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard icon="sparkle" title={svc.full?.title || ""} desc={svc.full?.desc || ""} />
          <ServiceCard icon="drop" title={svc.self?.title || ""} desc={svc.self?.desc || ""} />
          <ServiceCard icon="wand" title={svc.detail?.title || ""} desc={svc.detail?.desc || ""} />
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="panel sw-reveal-up overflow-hidden p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="section-eyebrow">Business Layer</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">Designed like a real operations platform.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                The project now communicates more than services. It shows capacity, booking flow maturity, retail integration,
                and trust signals that make the brand feel credible and ready for growth.
              </p>
              <Link to="/account" className="btn btn-outline mt-6">Explore client account area</Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {OPERATIONS_METRICS.map((metric) => (
                <div key={metric.label} className="metric-card sw-tilt-card">
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{metric.label}</div>
                  <div className="mt-3 text-3xl font-extrabold text-slate-950">{metric.value}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title={t("pricing.title")} subtitle={t("pricing.subtitle")} className="bg-white/50">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Plan {...(plans.self || { features: [] })} />
          <Plan {...(plans.express || { features: [] })} featured />
          <Plan {...(plans.premium || { features: [] })} />
        </div>
      </Section>

      <Section
        title="Shop SparkleWash"
        subtitle="Professional wash and detailing products, delivered directly to your door."
        className="bg-white/50"
      >
        <ShopPreviewSlider products={featuredProducts} onAdd={handleAdd} addedIds={addedIds} />
        <div className="mt-8 flex justify-center">
          <Link to="/shop" className="btn btn-primary px-10">Browse all products</Link>
        </div>
      </Section>

      <Section
        title="A clearer premium-service workflow"
        subtitle="Professional brands feel structured. This section turns the homepage into a guided customer journey instead of a static brochure."
      >
        <div className="grid gap-5 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.title} className="card sw-tilt-card relative p-7">
              <div className="absolute right-5 top-5 text-4xl font-black text-slate-100">{String(index + 1).padStart(2, "0")}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--sw-blue)]">
                <Icon name={step.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("why.title")} subtitle={t("why.subtitle")}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <WhyCard icon="clock" title={why.open?.title || ""} desc={why.open?.desc || ""} />
          <WhyCard icon="drop" title={why.eco?.title || ""} desc={why.eco?.desc || ""} />
          <WhyCard icon="badge" title={why.staff?.title || ""} desc={why.staff?.desc || ""} />
          <WhyCard icon="shield" title={why.guarantee?.title || ""} desc={why.guarantee?.desc || ""} />
          <WhyCard icon="cart" title="Online Shop" desc="Order premium car care essentials directly from our online store." />
        </div>
      </Section>

      <Section title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} className="bg-white/50">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <Testimonial key={item.name} {...item} />
          ))}
        </div>
      </Section>

      <Section title={t("gallery.title")} subtitle={t("gallery.subtitle")}>
        <BeforeAfterCarousel />
      </Section>

      <Section className="bg-white/55">
        <div className="panel overflow-hidden">
          <div className="grid gap-8 p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <span className="section-eyebrow">Growth Ready</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">Built to scale into a more serious customer experience.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Between the booking flow, storefront, admin area, and employee workspace, the project now presents itself as a small but credible digital ecosystem.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/book" className="btn btn-primary">Reserve a slot</Link>
                <Link to="/shop" className="btn btn-outline">Open the shop</Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="metric-card sw-tilt-card">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Customer touchpoints</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-extrabold">Bookings</div>
                    <div className="mt-1 text-sm text-slate-600">Service selection, scheduling, and follow-up.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-extrabold">Retail</div>
                    <div className="mt-1 text-sm text-slate-600">Cross-sell products with a cleaner cart experience.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-extrabold">Admin</div>
                    <div className="mt-1 text-sm text-slate-600">Operations panels for messages, bookings, staff, and stock.</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-extrabold">Trust</div>
                    <div className="mt-1 text-sm text-slate-600">Testimonials, metrics, and visual proof through the gallery.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t("contact.title")} subtitle={t("contact.subtitle")} className="bg-white/50">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--sw-blue)]">
                  <Icon name="pin" className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.location")}</div>
                  <div className="text-slate-600">123 Clean Street, Wash City, WC 12345</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--sw-blue)]">
                  <Icon name="phone" className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.phone")}</div>
                  <div className="text-slate-600">(555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--sw-blue)]">
                  <Icon name="mail" className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.email")}</div>
                  <div className="text-slate-600">info@sparklewash.com</div>
                </div>
              </div>

              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="font-extrabold">{t("contact.hours")}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  <div>{t("contact.fullHours")}</div>
                  <div>{t("contact.selfHours")}</div>
                </div>
              </div>

              <Link to="/book" className="btn btn-primary mt-2">{t("common.bookNow")}</Link>
            </div>
          </div>

          <div className="card p-7">
            <div className="text-xl font-extrabold">{t("contact.send")}</div>
            <p className="mt-2 text-slate-600">We typically respond within 2 hours.</p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                alert("Message sent (demo). Open Admin > Messages to see it.");
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.name")} />
                <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.email")} />
              </div>
              <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.phone")} />
              <textarea
                className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t("contact.placeholders.message")}
              />
              <button className="btn btn-primary" type="submit">
                {t("contact.sendBtn")}
              </button>
            </form>
            <div className="mt-4 text-xs text-slate-500">Demo form: no backend required.</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
