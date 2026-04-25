import React, { useMemo, useState } from "react";
import { listLocations } from "../lib/storage";
import { listEmployees, registerEmployee, updateEmployeeAssignment, updateEmployeeStatus } from "../lib/employeeAuth";

const STATUS_OPTIONS = [
  { value: "working", label: "Working", className: "sw-badge-confirmed" },
  { value: "resting", label: "Resting", className: "sw-badge-pending" },
  { value: "late", label: "Late", className: "sw-badge-canceled" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateTime(value) {
  if (!value) return "Not updated";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildDailySchedule(employee, selectedDate) {
  const dayLabel = DAY_LABELS[new Date(`${selectedDate}T12:00:00`).getDay()];
  const schedule = employee.schedule || {};
  const activeDays = Array.isArray(schedule.days) ? schedule.days : [];
  const worksToday = activeDays.includes(dayLabel);

  return {
    dayLabel,
    worksToday,
    shiftLabel: worksToday ? `${schedule.start || "09:00"} - ${schedule.end || "17:00"}` : "Rest day",
    weekLabel: activeDays.length > 0 ? activeDays.join(", ") : "No weekly schedule",
  };
}

function Avatar({ name }) {
  const initials = (name || "E")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 12,
        background: "linear-gradient(135deg, rgba(34,211,238,0.22), rgba(14,165,233,0.08))",
        border: "1px solid rgba(34,211,238,0.16)",
        color: "#67e8f9",
        fontSize: 12,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState(() => listEmployees());
  const [selectedDate, setSelectedDate] = useState(() => formatDateValue(new Date()));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    locationId: "loc_1",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const locations = useMemo(() => listLocations(), []);
  const locationNameMap = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations]);

  const employeeRows = useMemo(
    () =>
      employees
        .map((employee) => ({
          ...employee,
          dailySchedule: buildDailySchedule(employee, selectedDate),
        }))
        .filter((employee) => {
          const normalizedQuery = query.trim().toLowerCase();
          const matchesQuery = !normalizedQuery
            || `${employee.name} ${employee.email} ${employee.phone} ${employee.id}`.toLowerCase().includes(normalizedQuery);
          const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
          const matchesLocation = locationFilter === "all" || employee.locationId === locationFilter;
          return matchesQuery && matchesStatus && matchesLocation;
        }),
    [employees, locationFilter, query, selectedDate, statusFilter]
  );

  const summary = useMemo(() => {
    const onShift = employeeRows.filter((employee) => employee.dailySchedule.worksToday).length;
    const resting = employeeRows.length - onShift;
    const late = employeeRows.filter((employee) => employee.status === "late").length;
    return { total: employeeRows.length, onShift, resting, late };
  }, [employeeRows]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function refreshEmployees() {
    setEmployees(listEmployees());
  }

  function handleStatusChange(employeeId, status) {
    const result = updateEmployeeStatus(employeeId, status);
    if (result.ok) refreshEmployees();
  }

  function handleLocationChange(employeeId, locationId) {
    const result = updateEmployeeAssignment(employeeId, { locationId });
    if (result.ok) refreshEmployees();
  }

  function handleCreateEmployee(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Name, email, and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    const result = registerEmployee({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      locationId: form.locationId,
    });

    if (!result.ok) {
      setFormError(result.error === "auth.errors.emailExists" ? "This employee email already exists." : result.error);
      return;
    }

    refreshEmployees();
    setForm({ name: "", email: "", phone: "", password: "", locationId: "loc_1" });
    setFormSuccess("Employee account created successfully.");
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Employees</h1>
        <p className="sw-page-sub">Create staff accounts, assign them to locations, and inspect coverage with clearer visual identity.</p>
      </div>

      <div className="sw-card" style={{ padding: 22, marginBottom: 24 }}>
        <div className="sw-section-title">Add Employee</div>
        <form
          onSubmit={handleCreateEmployee}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr)) auto",
            gap: 10,
            alignItems: "end",
          }}
        >
          <div>
            <label className="sw-form-label">Name</label>
            <input className="sw-input" type="text" value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="Employee name" />
          </div>
          <div>
            <label className="sw-form-label">Email</label>
            <input className="sw-input" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="employee@example.com" />
          </div>
          <div>
            <label className="sw-form-label">Phone</label>
            <input className="sw-input" type="tel" value={form.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="+373 600 00 000" />
          </div>
          <div>
            <label className="sw-form-label">Location</label>
            <select className="sw-input" value={form.locationId} onChange={(event) => setField("locationId", event.target.value)}>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sw-form-label">Password</label>
            <input className="sw-input" type="password" value={form.password} onChange={(event) => setField("password", event.target.value)} placeholder="Minimum 6 characters" />
          </div>
          <button type="submit" className="sw-btn sw-btn-primary">Add Employee</button>
        </form>
        {formError ? <div style={{ marginTop: 12, fontSize: 12, color: "#fca5a5" }}>{formError}</div> : null}
        {formSuccess ? <div style={{ marginTop: 12, fontSize: 12, color: "#6ee7b7" }}>{formSuccess}</div> : null}
      </div>

      <div className="sw-card" style={{ padding: 22, marginBottom: 24, display: "grid", gridTemplateColumns: "220px 1fr", gap: 18, alignItems: "end" }}>
        <div>
          <div className="sw-section-title" style={{ marginBottom: 10 }}>Calendar</div>
          <input className="sw-input" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </div>
        <div>
          <div className="sw-section-title" style={{ marginBottom: 10 }}>Selected Day</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
            {formatSelectedDate(selectedDate)}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            Choose any date to see who is scheduled, resting, or late on that day.
          </div>
        </div>
      </div>

      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Visible Staff</div>
          <div className="sw-stat-value">{summary.total}</div>
          <div className="sw-stat-sub">employee accounts matching the current filters</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">On Shift</div>
          <div className="sw-stat-value">{summary.onShift}</div>
          <div className="sw-stat-sub">scheduled for {employeeRows[0]?.dailySchedule.dayLabel || "today"}</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Resting</div>
          <div className="sw-stat-value">{summary.resting}</div>
          <div className="sw-stat-sub">not scheduled on the selected day</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">Late</div>
          <div className="sw-stat-value">{summary.late}</div>
          <div className="sw-stat-sub">employees currently marked late</div>
        </div>
      </div>

      <div className="sw-toolbar" style={{ marginBottom: 20 }}>
        <div className="sw-toolbar-grid">
          <input className="sw-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee name, email, phone..." />
          <select className="sw-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select className="sw-input" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
          <button type="button" className="sw-btn sw-btn-ghost" onClick={() => { setQuery(""); setStatusFilter("all"); setLocationFilter("all"); }}>
            Clear Search
          </button>
        </div>
      </div>

      <div className="sw-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="sw-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Schedule For Day</th>
                <th>Weekly Pattern</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {employeeRows.map((employee) => {
                const activeStatus = STATUS_OPTIONS.find((item) => item.value === employee.status) || STATUS_OPTIONS[1];

                return (
                  <tr key={employee.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar name={employee.name} />
                        <div>
                          <strong>{employee.name}</strong>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{employee.email}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{employee.phone || "No phone number"}</div>
                    </td>
                    <td>
                      <select
                        className="sw-input"
                        value={employee.locationId || "loc_1"}
                        onChange={(event) => handleLocationChange(employee.id, event.target.value)}
                        style={{ minWidth: 170 }}
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                      </select>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                        {locationNameMap.get(employee.locationId || "loc_1") || "Unassigned"}
                      </div>
                    </td>
                    <td>
                      <span className={`sw-badge ${activeStatus.className}`}>{activeStatus.label}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {STATUS_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={employee.status === option.value ? "sw-btn sw-btn-primary" : "sw-btn sw-btn-ghost"}
                            style={{ height: 30, padding: "0 10px" }}
                            onClick={() => handleStatusChange(employee.id, option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: employee.dailySchedule.worksToday ? "#67e8f9" : "#94a3b8" }}>
                        {employee.dailySchedule.shiftLabel}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                        {employee.dailySchedule.worksToday ? "Scheduled to work" : "Not scheduled for this day"}
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: "#94a3b8" }}>{employee.dailySchedule.weekLabel}</td>
                    <td>{formatDateTime(employee.updatedAt)}</td>
                  </tr>
                );
              })}
              {employeeRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="sw-empty">No employees found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
