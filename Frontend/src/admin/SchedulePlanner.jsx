import React, { useEffect, useMemo, useState } from "react";
import { listLocations } from "../lib/storage";
import {
  listEmployees,
  removeEmployeeAssignment,
  updateEmployeeAssignment,
  updateEmployeeSchedule,
  upsertEmployeeAssignment,
} from "../lib/employeeAuth";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WORK_AREAS = [
  "Interior Cleaning",
  "Exterior Wash",
  "Cashier",
  "Detailing",
  "Drying Zone",
  "Customer Reception",
  "Vacuum Station",
  "Quality Check",
];

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDayLabelFromDate(value) {
  const dayIndex = new Date(`${value}T12:00:00`).getDay();
  return CALENDAR_DAYS[(dayIndex + 6) % 7];
}

function buildMonthDays(cursor) {
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const start = new Date(monthStart);
  const startOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - startOffset);

  const end = new Date(monthEnd);
  const endOffset = 6 - ((end.getDay() + 6) % 7);
  end.setDate(end.getDate() + endOffset);

  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function buildDrafts(employees) {
  return employees.reduce((acc, employee) => {
    acc[employee.id] = {
      days: Array.isArray(employee.schedule?.days) ? employee.schedule.days : [],
      start: employee.schedule?.start || "09:00",
      end: employee.schedule?.end || "17:00",
    };
    return acc;
  }, {});
}

function Avatar({ name, active = false }) {
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
        width: 38,
        height: 38,
        borderRadius: 14,
        background: active
          ? "linear-gradient(135deg, rgba(34,211,238,0.32), rgba(14,165,233,0.12))"
          : "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(15,23,42,0.18))",
        border: `1px solid ${active ? "rgba(34,211,238,0.22)" : "rgba(148,163,184,0.1)"}`,
        color: active ? "#67e8f9" : "#cbd5e1",
        fontSize: 12,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function EmployeePill({ employee, selected, onClick, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "12px 14px",
        borderRadius: 16,
        background: selected ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${selected ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.05)"}`,
        color: "#e2e8f0",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Avatar name={employee.name} active={selected} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? "#67e8f9" : "#f1f5f9" }}>{employee.name}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function MiniAssignment({ name, area }) {
  const initials = (name || "E")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        padding: "4px 6px",
        borderRadius: 10,
        background: "rgba(34,211,238,0.08)",
        border: "1px solid rgba(34,211,238,0.12)",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 7,
          background: "rgba(34,211,238,0.16)",
          color: "#67e8f9",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#cfefff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </div>
        <div style={{ fontSize: 8, color: "#8ab7c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {area}
        </div>
      </div>
    </div>
  );
}

function resolveEntry(employee, selectedDate, drafts) {
  const assignment = (Array.isArray(employee.assignments) ? employee.assignments : []).find((item) => item.date === selectedDate);
  if (assignment) {
    return {
      mode: "assignment",
      ...assignment,
    };
  }

  const dayLabel = getDayLabelFromDate(selectedDate);
  const weeklyDays = drafts[employee.id]?.days || [];
  if (weeklyDays.includes(dayLabel)) {
    return {
      mode: "weekly",
      date: selectedDate,
      area: "General Wash",
      start: drafts[employee.id]?.start || "09:00",
      end: drafts[employee.id]?.end || "17:00",
      locationId: employee.locationId || "loc_1",
    };
  }

  return null;
}

export default function AdminSchedulePlanner() {
  const [employees, setEmployees] = useState(() => listEmployees());
  const [drafts, setDrafts] = useState(() => buildDrafts(listEmployees()));
  const [selectedDate, setSelectedDate] = useState(() => formatDateValue(new Date()));
  const [calendarCursor, setCalendarCursor] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("all");

  const locations = useMemo(() => listLocations(), []);
  const locationNameMap = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations]);

  useEffect(() => {
    setDrafts(buildDrafts(employees));
  }, [employees]);

  const calendarDays = useMemo(() => buildMonthDays(calendarCursor), [calendarCursor]);
  const selectedDayLabel = useMemo(() => getDayLabelFromDate(selectedDate), [selectedDate]);
  const monthLabel = useMemo(
    () => calendarCursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    [calendarCursor]
  );

  const visibleEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchesQuery = !normalizedQuery || `${employee.name} ${employee.email}`.toLowerCase().includes(normalizedQuery);
        const matchesLocation = selectedLocationId === "all" || (employee.locationId || "loc_1") === selectedLocationId;
        return matchesQuery && matchesLocation;
      }),
    [employees, query, selectedLocationId]
  );

  useEffect(() => {
    if (selectedEmployeeId === "all") return;
    if (!visibleEmployees.find((employee) => employee.id === selectedEmployeeId)) {
      setSelectedEmployeeId(visibleEmployees[0]?.id || "all");
    }
  }, [selectedEmployeeId, visibleEmployees]);

  const selectedEmployee = useMemo(
    () => visibleEmployees.find((employee) => employee.id === selectedEmployeeId) || null,
    [selectedEmployeeId, visibleEmployees]
  );

  const selectedEntry = useMemo(
    () => (selectedEmployee ? resolveEntry(selectedEmployee, selectedDate, drafts) : null),
    [drafts, selectedDate, selectedEmployee]
  );

  const [assignmentForm, setAssignmentForm] = useState({
    area: "Interior Cleaning",
    start: "09:00",
    end: "17:00",
    locationId: "loc_1",
  });

  useEffect(() => {
    if (!selectedEmployee) return;
    const entry = resolveEntry(selectedEmployee, selectedDate, drafts);
    setAssignmentForm({
      area: entry?.area || "Interior Cleaning",
      start: entry?.start || drafts[selectedEmployee.id]?.start || "09:00",
      end: entry?.end || drafts[selectedEmployee.id]?.end || "17:00",
      locationId: entry?.locationId || selectedEmployee.locationId || "loc_1",
    });
  }, [drafts, selectedDate, selectedEmployee]);

  const scheduledOnSelectedDay = useMemo(
    () => visibleEmployees.filter((employee) => resolveEntry(employee, selectedDate, drafts)).length,
    [drafts, selectedDate, visibleEmployees]
  );

  const countsByDate = useMemo(() => {
    const counts = {};
    for (const employee of visibleEmployees) {
      for (const day of calendarDays) {
        const value = formatDateValue(day);
        if (resolveEntry(employee, value, drafts)) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }
    return counts;
  }, [calendarDays, drafts, visibleEmployees]);

  const assignmentsByDate = useMemo(() => {
    const result = {};

    for (const employee of visibleEmployees) {
      for (const day of calendarDays) {
        const value = formatDateValue(day);
        const entry = resolveEntry(employee, value, drafts);
        if (!entry) continue;

        if (!result[value]) result[value] = [];
        result[value].push({
          employeeId: employee.id,
          name: employee.name,
          area: entry.area,
          start: entry.start,
          end: entry.end,
          locationId: entry.locationId,
        });
      }
    }

    return result;
  }, [calendarDays, drafts, visibleEmployees]);

  const selectedDateAssignments = assignmentsByDate[selectedDate] || [];

  const locationScheduleBoard = useMemo(() => {
    const relevantLocations = selectedLocationId === "all"
      ? locations
      : locations.filter((location) => location.id === selectedLocationId);

    return relevantLocations.map((location) => {
      const employeesAtLocation = employees.filter((employee) => {
        const entry = resolveEntry(employee, selectedDate, drafts);
        return entry?.locationId === location.id;
      });

      return {
        ...location,
        scheduledEmployees: employeesAtLocation.map((employee) => ({
          employee,
          entry: resolveEntry(employee, selectedDate, drafts),
        })),
        totalEmployees: employees.filter((employee) => (employee.locationId || "loc_1") === location.id).length,
      };
    });
  }, [drafts, employees, locations, selectedDate, selectedLocationId]);

  function refreshEmployees() {
    const nextEmployees = listEmployees();
    setEmployees(nextEmployees);
    setDrafts(buildDrafts(nextEmployees));
  }

  function toggleDay(employeeId, day) {
    setDrafts((current) => {
      const currentDays = current[employeeId]?.days || [];
      const nextDays = currentDays.includes(day)
        ? currentDays.filter((item) => item !== day)
        : [...currentDays, day];

      return {
        ...current,
        [employeeId]: {
          ...current[employeeId],
          days: nextDays,
        },
      };
    });
  }

  function changeWeeklyField(employeeId, field, value) {
    setDrafts((current) => ({
      ...current,
      [employeeId]: {
        ...current[employeeId],
        [field]: value,
      },
    }));
  }

  function saveWeeklySchedule(employeeId) {
    const result = updateEmployeeSchedule(employeeId, drafts[employeeId]);
    if (!result.ok) return;
    refreshEmployees();
  }

  function saveEmployeeLocation(employeeId, locationId) {
    const result = updateEmployeeAssignment(employeeId, { locationId });
    if (!result.ok) return;
    refreshEmployees();
  }

  function saveAssignment() {
    if (!selectedEmployee) return;
    const result = upsertEmployeeAssignment(selectedEmployee.id, {
      date: selectedDate,
      area: assignmentForm.area,
      start: assignmentForm.start,
      end: assignmentForm.end,
      locationId: assignmentForm.locationId,
    });
    if (!result.ok) return;
    refreshEmployees();
  }

  function clearAssignment() {
    if (!selectedEmployee) return;
    const result = removeEmployeeAssignment(selectedEmployee.id, selectedDate);
    if (!result.ok) return;
    refreshEmployees();
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Schedule Planner</h1>
        <p className="sw-page-sub">Use the calendar to add real day-by-day employee shifts, choose the work area, and see all location schedules together.</p>
      </div>

      <div className="sw-toolbar" style={{ marginBottom: 20 }}>
        <div className="sw-chip-row">
          <button
            type="button"
            className={"sw-chip" + (selectedLocationId === "all" ? " active" : "")}
            onClick={() => setSelectedLocationId("all")}
          >
            All locations
          </button>
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              className={"sw-chip" + (selectedLocationId === location.id ? " active" : "")}
              onClick={() => setSelectedLocationId(location.id)}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="sw-toolbar-grid">
          <input
            className="sw-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search employee to focus the planner..."
          />
          <select className="sw-input" value={selectedEmployeeId} onChange={(event) => setSelectedEmployeeId(event.target.value)}>
            <option value="all">Select employee</option>
            {visibleEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
          <div className="sw-overview-card" style={{ padding: 12 }}>
            <div className="sw-overview-label">Visible Staff</div>
            <div className="sw-overview-value" style={{ fontSize: 20 }}>{visibleEmployees.length}</div>
          </div>
          <div className="sw-overview-card" style={{ padding: 12 }}>
            <div className="sw-overview-label">Scheduled On {selectedDayLabel}</div>
            <div className="sw-overview-value" style={{ fontSize: 20 }}>{scheduledOnSelectedDay}</div>
          </div>
        </div>
      </div>

      <div className="sw-split" style={{ gridTemplateColumns: "1.45fr 0.75fr", marginBottom: 24 }}>
        <div className="sw-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div className="sw-section-title" style={{ marginBottom: 6 }}>Calendar Focus</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>{monthLabel}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="sw-btn sw-btn-ghost"
                style={{ height: 34, padding: "0 12px" }}
                onClick={() => setCalendarCursor(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1))}
              >
                Prev
              </button>
              <button
                type="button"
                className="sw-btn sw-btn-ghost"
                style={{ height: 34, padding: "0 12px" }}
                onClick={() => setCalendarCursor(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1))}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
            {CALENDAR_DAYS.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: "#475569",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {calendarDays.map((day) => {
              const value = formatDateValue(day);
              const isCurrentMonth = day.getMonth() === calendarCursor.getMonth();
              const isSelected = value === selectedDate;
              const count = countsByDate[value] || 0;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedDate(value)}
                  style={{
                    minHeight: 126,
                    borderRadius: 16,
                    border: `1px solid ${isSelected ? "rgba(103,232,249,0.45)" : "rgba(255,255,255,0.07)"}`,
                    background: isSelected ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.02)",
                    color: isCurrentMonth ? "#e2e8f0" : "#475569",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    padding: "10px 8px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{day.getDate()}</div>
                  <div style={{ marginTop: 10, fontSize: 10, color: count > 0 ? "#67e8f9" : "#475569" }}>
                    {count > 0 ? `${count} staff scheduled` : "No shifts"}
                  </div>
                  <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                    {(assignmentsByDate[value] || []).slice(0, 2).map((assignment) => (
                      <MiniAssignment
                        key={`${value}-${assignment.employeeId}-${assignment.area}`}
                        name={assignment.name}
                        area={assignment.area}
                      />
                    ))}
                    {(assignmentsByDate[value] || []).length > 2 ? (
                      <div style={{ fontSize: 8, color: "#8ab7c8", fontWeight: 700 }}>
                        +{assignmentsByDate[value].length - 2} more
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sw-card" style={{ padding: 22 }}>
          <div className="sw-section-title">Calendar Inspector</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
            {formatLongDate(selectedDate)}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
            The calendar now previews the scheduled employees and work areas directly inside each day cell.
          </div>

          <div style={{ marginTop: 18 }} className="sw-section-title">Shifts On This Date</div>
          <div style={{ display: "grid", gap: 8, maxHeight: 180, overflowY: "auto" }}>
            {selectedDateAssignments.map((assignment) => (
              <div
                key={`${selectedDate}-${assignment.employeeId}-${assignment.area}`}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{assignment.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                  {assignment.area} | {assignment.start} - {assignment.end}
                </div>
              </div>
            ))}
            {selectedDateAssignments.length === 0 ? (
              <div className="sw-empty" style={{ padding: 16 }}>
                No one is scheduled yet for this date.
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 18 }} className="sw-section-title">Employees</div>
          <div style={{ display: "grid", gap: 10, maxHeight: 420, overflowY: "auto" }}>
            {visibleEmployees.map((employee) => {
              const entry = resolveEntry(employee, selectedDate, drafts);
              const subtitle = entry
                ? `${locationNameMap.get(entry.locationId) || "Unassigned"} | ${entry.area} | ${entry.start} - ${entry.end}`
                : `${locationNameMap.get(employee.locationId || "loc_1") || "Unassigned"} | No shift for this date`;

              return (
                <EmployeePill
                  key={employee.id}
                  employee={employee}
                  selected={selectedEmployee?.id === employee.id}
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  subtitle={subtitle}
                />
              );
            })}
            {visibleEmployees.length === 0 ? <div className="sw-empty">No employees match the current filters.</div> : null}
          </div>
        </div>
      </div>

      {selectedEmployee ? (
        <div className="sw-card" style={{ padding: 22, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
            <Avatar name={selectedEmployee.name} active />
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{selectedEmployee.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                {selectedEmployee.email} | {locationNameMap.get(selectedEmployee.locationId || "loc_1") || "Unassigned"}
              </div>
            </div>
            <select
              className="sw-input"
              value={selectedEmployee.locationId || "loc_1"}
              onChange={(event) => saveEmployeeLocation(selectedEmployee.id, event.target.value)}
              style={{ maxWidth: 220 }}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 160px 160px 220px auto auto" }}>
              <div>
                <label className="sw-form-label">Work Area For {formatLongDate(selectedDate)}</label>
                <select
                  className="sw-input"
                  value={assignmentForm.area}
                  onChange={(event) => setAssignmentForm((current) => ({ ...current, area: event.target.value }))}
                >
                  {WORK_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="sw-form-label">Start Time</label>
                <input
                  className="sw-input"
                  type="time"
                  value={assignmentForm.start}
                  onChange={(event) => setAssignmentForm((current) => ({ ...current, start: event.target.value }))}
                />
              </div>
              <div>
                <label className="sw-form-label">End Time</label>
                <input
                  className="sw-input"
                  type="time"
                  value={assignmentForm.end}
                  onChange={(event) => setAssignmentForm((current) => ({ ...current, end: event.target.value }))}
                />
              </div>
              <div>
                <label className="sw-form-label">Assignment Location</label>
                <select
                  className="sw-input"
                  value={assignmentForm.locationId}
                  onChange={(event) => setAssignmentForm((current) => ({ ...current, locationId: event.target.value }))}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="sw-btn sw-btn-primary" style={{ alignSelf: "end" }} onClick={saveAssignment}>
                Save Day Shift
              </button>
              <button type="button" className="sw-btn sw-btn-danger" style={{ alignSelf: "end" }} onClick={clearAssignment}>
                Clear Day Shift
              </button>
            </div>

            <div style={{ padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="sw-section-title" style={{ marginBottom: 10 }}>Weekly Default Pattern</div>
              <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 180px 180px auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(selectedEmployee.id, day)}
                      className={`sw-btn ${(drafts[selectedEmployee.id]?.days || []).includes(day) ? "sw-btn-primary" : "sw-btn-ghost"}`}
                      style={{ height: 38, padding: "0 8px", boxShadow: day === selectedDayLabel ? "0 0 0 1px rgba(251,191,36,0.35) inset" : "none" }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="sw-form-label">Default Start</label>
                  <input
                    className="sw-input"
                    type="time"
                    value={drafts[selectedEmployee.id]?.start || "09:00"}
                    onChange={(event) => changeWeeklyField(selectedEmployee.id, "start", event.target.value)}
                  />
                </div>
                <div>
                  <label className="sw-form-label">Default End</label>
                  <input
                    className="sw-input"
                    type="time"
                    value={drafts[selectedEmployee.id]?.end || "17:00"}
                    onChange={(event) => changeWeeklyField(selectedEmployee.id, "end", event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="sw-btn sw-btn-ghost"
                  style={{ alignSelf: "end" }}
                  onClick={() => saveWeeklySchedule(selectedEmployee.id)}
                >
                  Save Weekly Pattern
                </button>
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="sw-section-title" style={{ marginBottom: 10 }}>Current Selected-Day Result</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                {selectedEntry
                  ? `${selectedEntry.area} | ${selectedEntry.start} - ${selectedEntry.end} | ${locationNameMap.get(selectedEntry.locationId) || "Unassigned"} | ${selectedEntry.mode === "assignment" ? "Day-specific shift" : "Weekly default"}`
                  : "No shift currently defined for this date."}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="sw-card" style={{ padding: 22 }}>
        <div className="sw-section-title">Location Schedule Board</div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {locationScheduleBoard.map((location) => (
            <div
              key={location.id}
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{location.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    {location.scheduledEmployees.length} scheduled | {location.totalEmployees} assigned to this location
                  </div>
                </div>
                <button
                  type="button"
                  className="sw-btn sw-btn-ghost"
                  style={{ height: 32, padding: "0 12px" }}
                  onClick={() => setSelectedLocationId(location.id)}
                >
                  Open
                </button>
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {location.scheduledEmployees.map(({ employee, entry }) => (
                  <div
                    key={employee.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 14,
                      background: "rgba(2,6,23,0.38)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <Avatar name={employee.name} active={selectedEmployeeId === employee.id} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{employee.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
                        {entry.area} | {entry.start} - {entry.end}
                      </div>
                    </div>
                  </div>
                ))}
                {location.scheduledEmployees.length === 0 ? (
                  <div className="sw-empty" style={{ padding: 18 }}>
                    No employees scheduled here for {selectedDayLabel}.
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
