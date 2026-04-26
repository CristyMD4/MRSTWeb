import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminLogin, getAdminSession } from "../lib/adminAuth";
import { getClientSession, loginClient } from "../lib/clientAuth";
import { getEmployeeSession, loginEmployee } from "../lib/employeeAuth";

async function detectRoleAndLogin(email, password) {
  const adminResult = adminLogin(email, password);
  if (adminResult.ok) {
    return { ...adminResult, redirect: "/admin/dashboard" };
  }

  const employeeResult = loginEmployee({ email, password });
  if (employeeResult.ok) {
    return { ...employeeResult, redirect: "/employee/dashboard" };
  }

  const clientResult = await loginClient({ email, password });
  if (clientResult.ok) {
    return { ...clientResult, redirect: "/" };
  }

  return clientResult.error === "auth.errors.invalidCredentials"
    ? { ok: false, error: "auth.errors.invalidCredentials" }
    : clientResult;
}

const ACCESS_POINTS = [
  { title: "Client Portal", text: "Track bookings, manage your account, and reorder products in one place." },
  { title: "Employee Workspace", text: "Open daily assignments, check schedules, and follow shift instructions." },
  { title: "Admin Control", text: "Manage operations, staffing, locations, and customer flow with one login." },
];

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminSession()) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (getEmployeeSession()) {
      navigate("/employee/dashboard", { replace: true });
      return;
    }

    if (getClientSession()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErr("");
    setLoading(true);

    const result = await detectRoleAndLogin(email, password);

    setLoading(false);

    if (!result.ok) {
      setErr(t(result.error, { defaultValue: result.error }));
      return;
    }

    navigate(result.redirect || "/", { replace: true });
  };

  return (
    <section className="relative overflow-hidden bg-[#060b16] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(29,78,216,0.16),transparent_24%)]" />
      <div className="absolute inset-0 sw-auth-grid opacity-30" />
      <div className="sw-auth-orb sw-float left-10 top-20 h-44 w-44 bg-sky-400/30" />
      <div className="sw-auth-orb sw-float-delay bottom-20 right-16 h-36 w-36 bg-blue-500/28" />

      <div className="relative container-page">
        <div className="grid min-h-[calc(100vh-7rem)] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="badge border-sky-400/20 bg-sky-400/10 text-sky-200">Unified Access</div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              One login flow for customers, employees, and admins.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Sign in once and SparkleWash sends you to the right workspace automatically, with a cleaner and more professional access experience.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {ACCESS_POINTS.map((item) => (
                <div
                  key={item.title}
                  className="sw-tilt-card sw-tilt-card--soft rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                >
                  <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-sky-200/80">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sw-auth-panel sw-tilt-card sw-tilt-card--soft mx-auto w-full max-w-xl rounded-[32px] border border-white/10 bg-[rgba(15,23,42,0.82)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-sky-300">
                {t("auth.access.badge", { defaultValue: "Secure Access" })}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                {t("auth.login.title", { defaultValue: "Sign in" })}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {t("auth.access.subtitle", {
                  defaultValue: "Use your SparkleWash account and we will route you to the matching portal automatically.",
                })}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.email", { defaultValue: "Email" })}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  {t("auth.fields.password", { defaultValue: "Password" })}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  required
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition focus:border-sky-300/50 focus:bg-white/10"
                />
              </div>

              {err ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? t("auth.login.loading", { defaultValue: "Signing in..." })
                  : t("auth.login.submit", { defaultValue: "Access account" })}
              </button>
            </form>

            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Quick Demo Access</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="sw-tilt-card sw-tilt-card--soft rounded-2xl bg-[#0d1627] p-4">
                  <div className="text-sm font-bold text-white">Client</div>
                  <div className="mt-1 text-xs text-slate-400">Register a normal customer account</div>
                </div>
                <div className="sw-tilt-card sw-tilt-card--soft rounded-2xl bg-[#0d1627] p-4">
                  <div className="text-sm font-bold text-white">Employee</div>
                  <div className="mt-1 text-xs text-slate-400">Use `employee@sparklewash.com`</div>
                </div>
                <div className="sw-tilt-card sw-tilt-card--soft rounded-2xl bg-[#0d1627] p-4">
                  <div className="text-sm font-bold text-white">Admin</div>
                  <div className="mt-1 text-xs text-slate-400">Use the configured admin credentials</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-300">
              {t("auth.login.noAccount", { defaultValue: "Need an account?" })}{" "}
              <Link to="/register" className="font-semibold text-sky-300 hover:text-sky-200">
                {t("auth.login.register", { defaultValue: "Register here" })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
