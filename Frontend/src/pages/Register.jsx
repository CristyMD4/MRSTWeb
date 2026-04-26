import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getClientSession, registerClient } from "../lib/clientAuth";
import { getEmployeeSession, registerEmployee } from "../lib/employeeAuth";

const ROLE_OPTIONS = [
  { key: "customer", redirectTo: "/", accent: "from-sky-400 to-cyan-300" },
  { key: "employee", redirectTo: "/employee/dashboard", accent: "from-emerald-400 to-cyan-300" },
];

function getRoleConfig(role) {
  return ROLE_OPTIONS.find((option) => option.key === role) || ROLE_OPTIONS[0];
}

function getSessionForRole(role) {
  return role === "employee" ? getEmployeeSession() : getClientSession();
}

function registerByRole(role, payload) {
  return role === "employee"
    ? Promise.resolve(registerEmployee(payload))
    : registerClient(payload);
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const STRENGTH_COLORS = [
  "#0f172a",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#38bdf8",
];

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRole = searchParams.get("role") === "employee" ? "employee" : "customer";

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfig = useMemo(() => getRoleConfig(role), [role]);
  const strength = getPasswordStrength(form.password);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    const session = getSessionForRole(role);
    if (session) {
      navigate(roleConfig.redirectTo, { replace: true });
    }
  }, [navigate, role, roleConfig]);

  const updateRole = (nextRole) => {
    setRole(nextRole);
    setErr("");
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    });
    setSearchParams({ role: nextRole });
  };

  const setField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErr("");

    if (form.password !== form.confirm) {
      setErr(
        t("auth.errors.passwordMismatch", {
          defaultValue: "Passwords do not match.",
        })
      );
      return;
    }

    if (form.password.length < 6) {
      setErr(
        t("auth.errors.passwordTooShort", {
          defaultValue: "Password must be at least 6 characters.",
        })
      );
      return;
    }

    setLoading(true);

    const result = await registerByRole(role, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    setLoading(false);

    if (!result.ok) {
      setErr(t(result.error, { defaultValue: result.error }));
      return;
    }

    navigate(roleConfig.redirectTo, { replace: true });
  };

  return (
    <section className="relative overflow-hidden bg-[#060b16] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_22%)]" />
      <div className="absolute inset-0 sw-auth-grid opacity-30" />
      <div className="sw-auth-orb sw-float left-12 top-16 h-44 w-44 bg-emerald-400/26" />
      <div className="sw-auth-orb sw-float-delay bottom-16 right-18 h-36 w-36 bg-sky-400/24" />

      <div className="relative container-page">
        <div className="grid min-h-[calc(100vh-7rem)] gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="badge border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Create Your Access</div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Start with a sharper SparkleWash account experience.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Register as a customer or employee and enter a polished ecosystem built for bookings, shop orders, schedules, and operations.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => updateRole(option.key)}
                  className={
                    "sw-tilt-card sw-tilt-card--soft rounded-[28px] border p-6 text-left transition " +
                    (role === option.key
                      ? "border-white/10 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                      : "border-white/8 bg-white/[0.04] hover:bg-white/[0.07]")
                  }
                >
                  <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-950 ${option.accent}`}>
                    {t(`auth.registerRoles.${option.key}.eyebrow`, { defaultValue: option.key })}
                  </div>
                  <div className="mt-4 text-2xl font-extrabold text-white">
                    {t(`auth.registerRoles.${option.key}.title`, { defaultValue: option.key })}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">
                    {t(`auth.registerRoles.${option.key}.description`, {
                      defaultValue: "Create your account to continue.",
                    })}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-amber-300/18 bg-amber-400/8 p-5 text-sm text-amber-100">
              <div className="font-bold uppercase tracking-[0.18em]">Admin Accounts</div>
              <div className="mt-2 leading-6 text-amber-50/90">
                Admin registration stays disabled here. Use the login page with the configured admin credentials.
              </div>
            </div>
          </div>

          <div className="sw-auth-panel sw-tilt-card sw-tilt-card--soft mx-auto w-full max-w-2xl rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.82)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-sky-300">
                {t(`auth.registerRoles.${role}.eyebrow`, { defaultValue: role })}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                {t(`auth.registerRoles.${role}.title`, { defaultValue: "Create account" })}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {t(`auth.registerRoles.${role}.description`, {
                  defaultValue: "Create your account to continue.",
                })}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.name", { defaultValue: "Full name" })}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.email", { defaultValue: "Email" })}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.phone", { defaultValue: "Phone" })}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.password", { defaultValue: "Password" })}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={setField("password")}
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />

                {form.password ? (
                  <>
                    <div className="mt-3 flex gap-2">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="h-2 flex-1 rounded-full"
                          style={{
                            backgroundColor: item <= strength ? STRENGTH_COLORS[strength] : "#1e293b",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Strength score: {strength}/5</div>
                  </>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.confirmPassword", { defaultValue: "Confirm password" })}
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              {err ? (
                <div className="md:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={`md:col-span-2 h-14 w-full rounded-2xl bg-gradient-to-r ${roleConfig.accent} text-sm font-extrabold uppercase tracking-[0.18em] text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {loading
                  ? t("auth.register.loading", { defaultValue: "Creating account..." })
                  : t(`auth.registerRoles.${role}.submitText`, {
                      defaultValue: "Create account",
                    })}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              {t("auth.register.hasAccount", { defaultValue: "Already have an account?" })}{" "}
              <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
                {t("auth.register.login", { defaultValue: "Sign in" })}
              </Link>
            </div>

            <div className="mt-3 text-center">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-300">
                {t("auth.backToSite", { defaultValue: "Back to site" })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
