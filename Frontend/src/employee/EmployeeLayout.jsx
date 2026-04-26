import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutEmployee, requireEmployee } from "../lib/employeeAuth";

const EMPLOYEE_STYLES = `
.sw-employee-root {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 32%),
    linear-gradient(180deg, #07111f 0%, #04080f 100%);
  color: #e2e8f0;
}
.sw-employee-grid {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}
.sw-employee-sidebar {
  padding: 28px 22px;
  border-right: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(16px);
}
.sw-employee-brand {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #f8fafc;
}
.sw-employee-brand span {
  color: #38bdf8;
}
.sw-employee-caption {
  margin-top: 8px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}
.sw-employee-section {
  margin-top: 28px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #475569;
}
.sw-employee-link {
  display: block;
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration: none;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
.sw-employee-link.active {
  color: #e0f2fe;
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.2);
}
.sw-employee-main {
  padding: 28px;
}
.sw-employee-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.sw-employee-topbar h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
}
.sw-employee-topbar p {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 14px;
}
.sw-employee-actions {
  display: flex;
  gap: 10px;
}
.sw-employee-btn {
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.78);
  color: #e2e8f0;
  text-decoration: none;
  cursor: pointer;
}
@media (max-width: 860px) {
  .sw-employee-grid {
    grid-template-columns: 1fr;
  }
  .sw-employee-sidebar {
    border-right: 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }
  .sw-employee-topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export default function EmployeeLayout() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!requireEmployee()) {
      nav("/login?role=employee", { replace: true });
    }
  }, [nav]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [loc.pathname, loc.search]);

  return (
    <div className="sw-employee-root">
      <style>{EMPLOYEE_STYLES}</style>
      <div className="sw-employee-grid">
        <aside className="sw-employee-sidebar">
          <div className="sw-employee-brand">
            Sparkle<span>Wash</span>
          </div>
          <div className="sw-employee-caption">
            {t("employee.caption", {
              defaultValue: "Internal workspace for staff operations, appointments, and customer support follow-up.",
            })}
          </div>

          <div className="sw-employee-section">{t("employee.workspace", { defaultValue: "Workspace" })}</div>
          <Link
            to="/employee/dashboard"
            className={"sw-employee-link" + (loc.pathname === "/employee/dashboard" ? " active" : "")}
          >
            {t("employee.dashboardLink", { defaultValue: "Staff Dashboard" })}
          </Link>
        </aside>

        <main className="sw-employee-main">
          <div className="sw-employee-topbar">
            <div>
              <h1>{t("employee.title", { defaultValue: "Employee Portal" })}</h1>
              <p>{t("employee.subtitle", { defaultValue: "Shift-ready tools for bookings, wash bays, and customer handoff notes." })}</p>
            </div>
            <div className="sw-employee-actions">
              <Link className="sw-employee-btn" to="/">
                {t("employee.viewSite", { defaultValue: "View Site" })}
              </Link>
              <button
                className="sw-employee-btn"
                type="button"
                onClick={() => {
                  logoutEmployee();
                  nav("/login?role=employee", { replace: true });
                }}
              >
                {t("employee.logout", { defaultValue: "Log Out" })}
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
