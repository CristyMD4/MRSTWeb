import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getEmployeeById, getEmployeeSession } from "../lib/employeeAuth";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayLabel() {
  return DAY_LABELS[new Date().getDay()];
}

function getTodayDateValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const session = getEmployeeSession();
  const employee = session?.id ? getEmployeeById(session.id) : null;
  const todayLabel = getTodayLabel();
  const todayDate = getTodayDateValue();

  const schedule = employee?.schedule || { days: [], start: "09:00", end: "17:00" };
  const todayAssignment = (Array.isArray(employee?.assignments) ? employee.assignments : []).find(
    (assignment) => assignment.date === todayDate
  );
  const worksToday = !!todayAssignment || schedule.days.includes(todayLabel);
  const todayShift = todayAssignment
    ? `${todayAssignment.start} - ${todayAssignment.end}`
    : worksToday
      ? `${schedule.start} - ${schedule.end}`
      : "Rest day";
  const weeklyPattern = schedule.days.length > 0 ? schedule.days.join(", ") : "No scheduled days";

  const stats = [
    {
      label: t("employee.stats.todayStatus", { defaultValue: "Today Status" }),
      value: worksToday ? "On Shift" : "Off Duty",
      note: todayAssignment
        ? `${todayAssignment.area} at ${todayShift}`
        : worksToday
          ? `Scheduled for ${todayShift}`
          : "No shift assigned for today",
    },
    {
      label: t("employee.stats.weekPattern", { defaultValue: "Week Pattern" }),
      value: schedule.days.length,
      note: schedule.days.length > 0 ? `${schedule.days.length} active days this week` : "No weekly shifts configured",
    },
    {
      label: t("employee.stats.currentStatus", { defaultValue: "Team Status" }),
      value: employee?.status || "resting",
      note: t("employee.stats.currentStatusNote", { defaultValue: "Updated by admin from the employee manager" }),
    },
  ];

  const tasks = useMemo(
    () => [
      worksToday
        ? `Start your shift window at ${schedule.start} and prepare your station before the first booking.`
        : "No shift is assigned for today. Check with admin if you expected to work.",
      todayAssignment
        ? `Today's assigned area is ${todayAssignment.area} at ${todayAssignment.locationId}.`
        : "No day-specific area has been assigned for today.",
      schedule.days.length > 0
        ? `Your current weekly schedule is ${weeklyPattern}.`
        : "Your weekly schedule is empty. Ask admin to assign working days if needed.",
      "Review the portal before leaving so any schedule changes are visible for the next day.",
    ],
    [schedule.start, schedule.days.length, todayAssignment, weeklyPattern, worksToday]
  );

  return (
    <div className="grid gap-6">
      <section
        style={{
          padding: 24,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(15,23,42,0.84))",
          border: "1px solid rgba(56,189,248,0.22)",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#bae6fd" }}>
          {t("employee.signedIn", { defaultValue: "Signed In" })}
        </div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em" }}>
          {session?.name || t("employee.fallbackName", { defaultValue: "Employee" })}
        </div>
        <div style={{ marginTop: 6, color: "#cbd5e1" }}>
          {session?.email || "employee@sparklewash.com"}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "rgba(2, 6, 23, 0.42)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7dd3fc" }}>
              Today's Shift
            </div>
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800 }}>{todayShift}</div>
            <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 13 }}>
              {todayAssignment
                ? `${todayLabel} assignment: ${todayAssignment.area}.`
                : worksToday
                  ? `${todayLabel} is an active work day.`
                  : `${todayLabel} is currently a rest day.`}
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "rgba(2, 6, 23, 0.42)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7dd3fc" }}>
              Weekly Schedule
            </div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>{weeklyPattern}</div>
            <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 13 }}>
              Standard shift hours: {schedule.start} - {schedule.end}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.84)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 12 }}>{item.label}</div>
            <div style={{ marginTop: 8, fontSize: 34, fontWeight: 800, textTransform: "capitalize" }}>{item.value}</div>
            <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: 13 }}>{item.note}</div>
          </div>
        ))}
      </section>

      <section
        style={{
          padding: 22,
          borderRadius: 18,
          background: "rgba(15, 23, 42, 0.84)",
          border: "1px solid rgba(148, 163, 184, 0.12)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {t("employee.checklist", { defaultValue: "Shift Checklist" })}
        </div>
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {tasks.map((task) => (
            <div
              key={task}
              style={{
                padding: 14,
                borderRadius: 14,
                background: "rgba(2, 6, 23, 0.6)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                color: "#e2e8f0",
              }}
            >
              {task}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
