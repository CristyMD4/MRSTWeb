import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getClientSession, logoutClient } from "../lib/clientAuth";

export default function Account() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const session = getClientSession();

  if (!session) {
    nav("/login?role=customer", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container-page py-14">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] md:p-10">
          <div className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-700">
            {t("account.badge")}
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                {t("account.title", { name: session.name })}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {t("account.subtitle")}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{t("account.name")}</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{session.name}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{t("account.email")}</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{session.email}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/book" className="btn btn-primary h-11 px-6">
                  {t("account.bookWash")}
                </Link>
                <Link to="/services" className="btn btn-outline h-11 px-6">
                  {t("account.exploreServices")}
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{t("account.quickActions")}</div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-white bg-white p-4">
                  <div className="font-semibold text-slate-900">{t("account.fasterBooking")}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {t("account.fasterBookingDesc")}
                  </div>
                </div>
                <div className="rounded-2xl border border-white bg-white p-4">
                  <div className="font-semibold text-slate-900">{t("account.support")}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {t("account.supportDesc")}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left font-semibold text-rose-700 transition hover:bg-rose-100"
                  onClick={() => {
                    logoutClient();
                    nav("/login?role=customer", { replace: true });
                  }}
                >
                  {t("account.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
