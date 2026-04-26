import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";
import { Icon } from "./Icons";
import { getAdminSession } from "../lib/adminAuth";
import { getClientSession } from "../lib/clientAuth";
import { getEmployeeSession } from "../lib/employeeAuth";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { to: "/", label: "nav.home" },
  { to: "/services", label: "nav.services" },
  { to: "/pricing", label: "nav.pricing" },
  { to: "/gallery", label: "nav.gallery" },
  { to: "/contact", label: "nav.contact" },
  { to: "/shop", label: "nav.shop", fallback: "Shop" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const clientSession = getClientSession();
  const employeeSession = getEmployeeSession();
  const adminSession = getAdminSession();
  const { cartCount } = useCart();

  const accountTarget = adminSession
    ? "/admin/dashboard"
    : employeeSession
      ? "/employee/dashboard"
      : clientSession
        ? "/account"
        : "/login";

  const accountLabel = adminSession
    ? "Admin"
    : employeeSession
      ? "Employee"
      : clientSession
        ? "My Account"
        : "Sign In";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/78 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between py-2 md:py-2.5">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--sw-blue)] to-[var(--sw-blue-dark)] text-sm font-black text-white shadow-[0_12px_26px_rgba(29,78,216,0.22)]">
              SW
            </div>
            <div>
              <div className="text-[15px] font-extrabold tracking-tight text-slate-950 md:text-base">SparkleWash</div>
              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:block">
                Premium Car Care
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-white/80 bg-white/85 p-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)] xl:flex">
            {NAV_LINKS.map(({ to, label, fallback }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition " +
                  (isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                }
              >
                {t(label, { defaultValue: fallback || label })}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden 2xl:flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
              Live booking availability
            </div>

            <div className="hidden xl:block">
              <LanguageSwitch />
            </div>

            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-slate-200"
              onClick={() => setOpen(false)}
            >
              <Icon name="cart" className="w-5 h-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sw-blue)] text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              ) : null}
            </Link>

            <Link to={accountTarget} className="hidden xl:inline-flex btn btn-outline h-10 px-3.5 text-sm">
              {accountLabel}
            </Link>

            <Link to="/book" className="hidden xl:inline-flex btn btn-primary h-10 px-4 text-sm">
              {t("common.bookNow")}
            </Link>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] xl:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label="Menu"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 top-[69px] z-40 overflow-y-auto border-t border-white/80 bg-[#f6f9fe]/95 backdrop-blur-xl xl:hidden">
          <div className="container-page flex flex-col gap-1 py-6">
            {NAV_LINKS.map(({ to, label, fallback }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "flex items-center rounded-2xl px-4 py-3 text-base font-semibold transition " +
                  (isActive ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-white")
                }
              >
                {t(label, { defaultValue: fallback || label })}
              </NavLink>
            ))}

            <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
              <div className="flex justify-center">
                <LanguageSwitch />
              </div>
              <Link to={accountTarget} onClick={() => setOpen(false)} className="btn btn-outline w-full justify-center">
                {accountLabel}
              </Link>
              <Link to="/book" onClick={() => setOpen(false)} className="btn btn-primary w-full justify-center">
                {t("common.bookNow")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
