import React, { useMemo, useState } from "react";
import { deleteBooking, listBookings, listLocations, updateBooking } from "../lib/storage";
import { getAdminLocation, setAdminLocation } from "../lib/adminLocation";

function StatusBadge({ status }) {
  const value = (status || "new").toLowerCase();
  return <span className={`sw-badge sw-badge-${value}`}>{status || "new"}</span>;
}

export default function AdminBookings() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [locationId, setLocationId] = useState(() => getAdminLocation());
  const [rows, setRows] = useState(() => listBookings());
  const [selectedDate, setSelectedDate] = useState("");

  const locations = useMemo(() => listLocations(), []);
  const locationName = useMemo(() => {
    const map = new Map(locations.map((location) => [location.id, location.name]));
    return (id) => map.get(id) || id || "-";
  }, [locations]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows
      .filter((booking) => locationId === "all" || (booking.locationId || "loc_1") === locationId)
      .filter((booking) => status === "all" || (booking.status || "new") === status)
      .filter((booking) => !selectedDate || (booking.date || "").slice(0, 10) === selectedDate)
      .filter((booking) => {
        if (!normalizedQuery) return true;
        return `${booking.fullName || booking.name || ""} ${booking.email || ""} ${booking.phone || ""} ${booking.id || ""} ${locationName(booking.locationId)}`
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [locationId, locationName, query, rows, selectedDate, status]);

  const counts = useMemo(() => {
    const result = {};
    rows.forEach((booking) => {
      const value = booking.status || "new";
      result[value] = (result[value] || 0) + 1;
    });
    return result;
  }, [rows]);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((booking) => (booking.date || "").slice(0, 10) === today).length;
  const visibleRevenue = filtered.reduce(
    (sum, booking) => sum + ((booking.status || "") === "completed" ? 35 : 0),
    0
  );

  function refresh() {
    setRows(listBookings());
  }

  function mutate(id, patch) {
    updateBooking(id, patch);
    refresh();
  }

  function remove(id) {
    if (!confirm("Delete this booking?")) return;
    deleteBooking(id);
    refresh();
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setSelectedDate("");
    setLocationId("all");
    setAdminLocation("all");
  }

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="sw-page-h1">Bookings</h1>
          <p className="sw-page-sub">{filtered.length} of {rows.length} bookings</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(counts).map(([key, value]) => (
            <span key={key} className={`sw-badge sw-badge-${key}`}>{value} {key}</span>
          ))}
        </div>
      </div>

      <div className="sw-overview-grid" style={{ marginBottom: 18 }}>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Visible Queue</div>
          <div className="sw-overview-value">{filtered.length}</div>
          <div className="sw-overview-sub">Bookings matching the current filters and search query.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Today</div>
          <div className="sw-overview-value">{todayCount}</div>
          <div className="sw-overview-sub">Appointments scheduled for today across all statuses.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Completed Revenue</div>
          <div className="sw-overview-value">${visibleRevenue.toFixed(0)}</div>
          <div className="sw-overview-sub">Estimated revenue from completed bookings in the current result set.</div>
        </div>
      </div>

      <div className="sw-toolbar" style={{ marginBottom: 20 }}>
        <div className="sw-chip-row">
          {["all", "new", "pending", "confirmed", "completed", "canceled"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={"sw-chip" + (status === value ? " active" : "")}
            >
              {value === "all" ? "All status" : value}
            </button>
          ))}
        </div>

        <div className="sw-toolbar-grid">
          <input
            className="sw-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, phone..."
          />
          <select className="sw-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All status</option>
            <option value="new">new</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="canceled">canceled</option>
          </select>
          <input className="sw-input" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          <select
            className="sw-input"
            value={locationId}
            onChange={(event) => {
              setLocationId(event.target.value);
              setAdminLocation(event.target.value);
            }}
          >
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>

        <div className="sw-page-actions">
          <button type="button" className="sw-btn sw-btn-ghost" onClick={resetFilters}>
            Reset Filters
          </button>
          <div className="sw-inline-note">
            Tip: choose a location first, then process the queue with the status chips for faster admin work.
          </div>
        </div>
      </div>

      <div className="sw-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="sw-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Service</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.fullName || booking.name || "-"}</strong>
                    <div style={{ fontSize: 11, marginTop: 2 }}>{booking.email || "-"}</div>
                    <div style={{ fontSize: 11 }}>{booking.phone || "-"}</div>
                    <div style={{ fontSize: 9, color: "#475569", marginTop: 4 }}>{booking.id}</div>
                  </td>
                  <td><span style={{ color: "#94a3b8" }}>{locationName(booking.locationId || "loc_1")}</span></td>
                  <td>
                    <strong>{booking.service || "-"}</strong>
                    <div style={{ fontSize: 11 }}>{booking.vehicle || "-"}</div>
                  </td>
                  <td>
                    <strong>{booking.date || "-"}</strong>
                    <div style={{ fontSize: 11 }}>{booking.time || "-"}</div>
                    {booking.notes ? (
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>Note: {booking.notes}</div>
                    ) : null}
                  </td>
                  <td><StatusBadge status={booking.status} /></td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <button className="sw-btn sw-btn-success" onClick={() => mutate(booking.id, { status: "confirmed" })}>Confirm</button>
                      <button className="sw-btn sw-btn-primary" onClick={() => mutate(booking.id, { status: "completed" })}>Complete</button>
                      <button className="sw-btn sw-btn-ghost" onClick={() => mutate(booking.id, { status: "canceled" })}>Cancel</button>
                      <button className="sw-btn sw-btn-danger" onClick={() => remove(booking.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="sw-empty">
                    No bookings match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
