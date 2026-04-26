import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 overflow-hidden border-t border-white/60 bg-[#0b1220] text-slate-200">
      <div className="container-page py-14">
        <div className="mb-10 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 px-6 py-6 md:grid-cols-[1.4fr_0.8fr] md:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200/70">SparkleWash</div>
            <div className="mt-2 text-2xl font-extrabold text-white">Clean, fast, and premium by design.</div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              A multi-service car care platform with online booking, retail products, account tracking, and internal tools for operations.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Coverage</div>
              <div className="mt-2 text-xl font-extrabold text-white">7 days / week</div>
              <div className="mt-1 text-sm text-slate-300">Online booking and support workflow</div>
            </div>
            <Link to="/book" className="btn btn-primary h-full min-h-11 px-6 text-sm">
              {t("common.bookNow")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-2xl font-extrabold text-white">SparkleWash</div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{t("footer.tagline")}</p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <div>123 Clean Street, Wash City</div>
              <div>(555) 123-4567</div>
              <div>info@sparklewash.com</div>
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("footer.quickLinks")}</div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link className="hover:text-white" to="/">{t("nav.home")}</Link>
              <Link className="hover:text-white" to="/services">{t("nav.services")}</Link>
              <Link className="hover:text-white" to="/pricing">{t("nav.pricing")}</Link>
              <Link className="hover:text-white" to="/contact">{t("nav.contact")}</Link>
              <Link className="hover:text-white" to="/shop">Shop</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("footer.services")}</div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link className="hover:text-white" to="/services/full-service">Full-Service Wash</Link>
              <Link className="hover:text-white" to="/services/self-service">Self-Service Wash</Link>
              <Link className="hover:text-white" to="/services/premium-detailing">Premium Detailing</Link>
              <Link className="hover:text-white" to="/services/interior-cleaning">Interior Cleaning</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("footer.followUs")}</div>
            <div className="mt-4 flex items-center gap-3">
              {[
                { label: "Fb", title: "Facebook" },
                { label: "Ig", title: "Instagram" },
                { label: "X", title: "X" },
              ].map((social) => (
                <a
                  key={social.title}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  aria-label={social.title}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
                >
                  <span className="font-bold">{social.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Built to feel like a full-service digital storefront, not just a static presentation site.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} SparkleWash. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
