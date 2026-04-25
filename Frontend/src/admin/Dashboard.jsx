import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listBookings, listLocations, listMessages, listTestimonials } from "../lib/storage";
import { getAdminLocation, setAdminLocation, subscribeAdminLocation } from "../lib/adminLocation";

function StatCard({ label, value, sub, accent = "#22d3ee" }) {
  return (
    <div className="sw-stat-card" style={{ borderColor: `${accent}18` }}>
      <div className="sw-stat-label">{label}</div>
      <div className="sw-stat-value" style={{ color: accent }}>{value}</div>
      {sub ? <div className="sw-stat-sub">{sub}</div> : null}
    </div>
  );
}

function MiniBar({ label, value, max, color = "#22d3ee" }) {
  const pct = max ? Math.round((value / max) * 100) : 0;

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 8px ${color}44`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ label, time, type }) {
  const colors = {
    booking: "#22d3ee",
    message: "#a78bfa",
    testimonial: "#34d399",
  };
  const color = colors[type] || "#475569";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          marginTop: 5,
          flexShrink: 0,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{label}</div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
}

function LocationCard({ loc, stats, active, onSelect }) {
  const features = [
    loc.features?.selfWashBoxes && `${loc.features.selfWashBoxes} self-wash`,
    loc.features?.carWashLanes && `${loc.features.carWashLanes} lanes`,
    loc.features?.hasStore && "store",
  ].filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onSelect(loc.id)}
      style={{
        all: "unset",
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        background: active ? "rgba(34,211,238,0.06)" : "rgba(10,18,32,0.7)",
        border: `1px solid ${active ? "rgba(34,211,238,0.28)" : "rgba(34,211,238,0.09)"}`,
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.18s",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#67e8f9" : "#94a3b8" }}>
          {loc.name}
        </div>
        {active ? (
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#22d3ee",
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.2)",
              borderRadius: 99,
              padding: "2px 8px",
            }}
          >
            ACTIVE
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: 10, color: "#475569", marginTop: 5 }}>{features.join(" · ") || "-"}</div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 8, color: "#334155", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
            Bookings
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#67e8f9", fontFamily: "'Syne', sans-serif" }}>
            {stats?.total || 0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8, color: "#334155", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
            Revenue
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399", fontFamily: "'Syne', sans-serif" }}>
            ${((stats?.revenue) || 0).toFixed(0)}
          </div>
        </div>
      </div>
    </button>
  );
}

function calcStats(bookings) {
  const byStatus = {};
  const svcCount = {};
  let revenue = 0;

  for (const booking of bookings) {
    const status = booking.status || "new";
    byStatus[status] = (byStatus[status] || 0) + 1;
    if (status === "completed") revenue += 35;
    const service = booking.service || "Unknown";
    svcCount[service] = (svcCount[service] || 0) + 1;
  }

  const topService = Object.entries(svcCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  return { total: bookings.length, byStatus, revenue, topService, svcCount };
}

function relTime(ts) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboard() {
  const [selected, setSelected] = useState(() => getAdminLocation());

  useEffect(() => subscribeAdminLocation(setSelected), []);

  const locations = useMemo(() => listLocations(), []);
  const allBookings = useMemo(() => listBookings(), []);
  const messages = useMemo(() => listMessages(), []);
  const testimonials = useMemo(() => listTestimonials(), []);

  const filteredBookings = useMemo(
    () => (selected === "all" ? allBookings : allBookings.filter((booking) => (booking.locationId || "loc_1") === selected)),
    [allBookings, selected]
  );

  const stats = useMemo(() => calcStats(filteredBookings), [filteredBookings]);
  const byLocationStats = useMemo(() => {
    const result = {};
    for (const location of locations) {
      result[location.id] = calcStats(allBookings.filter((booking) => (booking.locationId || "loc_1") === location.id));
    }
    return result;
  }, [allBookings, locations]);

  const unread = useMemo(() => messages.filter((message) => !message.read).length, [messages]);
  const pendingTestimonials = useMemo(
    () => testimonials.filter((item) => item.status === "pending" || !item.approved).length,
    [testimonials]
  );

  const activity = useMemo(() => {
    const items = [
      ...filteredBookings.slice(0, 5).map((booking) => ({
        label: `Booking from ${booking.fullName || booking.name || "-"} · ${booking.service || "-"}`,
        time: relTime(booking.at || Date.now()),
        ts: booking.at || 0,
        type: "booking",
      })),
      ...messages.slice(0, 3).map((message) => ({
        label: `Message from ${message.name || "-"}: "${(message.message || "").slice(0, 40)}..."`,
        time: relTime(message.at || Date.now()),
        ts: message.at || 0,
        type: "message",
      })),
    ];
    return items.sort((a, b) => b.ts - a.ts).slice(0, 8);
  }, [filteredBookings, messages]);

  const completedRate = stats.total ? Math.round(((stats.byStatus.completed || 0) / stats.total) * 100) : 0;
  const maxServiceCount = Math.max(...Object.values(stats.svcCount || {}), 1);
  const newBookings = stats.byStatus.new || 0;

  function select(id) {
    const nextValue = id || "all";
    setAdminLocation(nextValue);
    setSelected(nextValue);
  }

  return (
    <div>
      <div className="sw-page-header">
        <h1 className="sw-page-h1">Dashboard</h1>
        <p className="sw-page-sub">
          {selected === "all"
            ? "Showing metrics across all locations"
            : `Showing metrics for ${locations.find((location) => location.id === selected)?.name || selected}`}
        </p>
      </div>

      <div className="sw-overview-grid" style={{ marginBottom: 20 }}>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Operational Focus</div>
          <div className="sw-overview-value">{newBookings}</div>
          <div className="sw-overview-sub">New bookings waiting for review or confirmation.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Completion Rate</div>
          <div className="sw-overview-value">{completedRate}%</div>
          <div className="sw-overview-sub">Share of visible bookings already completed.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Quick Actions</div>
          <div className="sw-page-actions" style={{ marginTop: 12 }}>
            <Link className="sw-btn sw-btn-primary" to="/admin/bookings">Open Bookings</Link>
            <Link className="sw-btn sw-btn-ghost" to="/admin/messages">Check Messages</Link>
            <Link className="sw-btn sw-btn-ghost" to="/admin/employees">Manage Staff</Link>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {[{ id: "all", name: "All Locations" }, ...locations].map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => select(location.id)}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "5px 14px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.15s",
              background: selected === location.id ? "rgba(34,211,238,0.12)" : "transparent",
              color: selected === location.id ? "#67e8f9" : "#475569",
              border: `1px solid ${selected === location.id ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            {location.name}
          </button>
        ))}
      </div>

      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Bookings" value={stats.total} sub={`${stats.byStatus.new || 0} new`} />
        <StatCard label="Revenue (est.)" value={`$${stats.revenue.toFixed(0)}`} sub="from completed" accent="#34d399" />
        <StatCard label="Unread Messages" value={unread} sub={`${messages.length} total`} accent="#a78bfa" />
        <StatCard label="Pending Reviews" value={pendingTestimonials} sub="testimonials" accent="#f59e0b" />
      </div>

      <div className="sw-split" style={{ marginBottom: 16 }}>
        <div className="sw-card" style={{ padding: 22 }}>
          <div className="sw-section-title">Service Breakdown</div>
          {Object.entries(stats.svcCount || {}).length > 0 ? (
            Object.entries(stats.svcCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([service, count]) => (
                <MiniBar key={service} label={service} value={count} max={maxServiceCount} />
              ))
          ) : (
            <div style={{ fontSize: 12, color: "#475569" }}>No bookings yet.</div>
          )}

          <div className="sw-divider" style={{ margin: "18px 0" }} />
          <div className="sw-section-title">Status Overview</div>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <MiniBar
              key={status}
              label={status}
              value={count}
              max={stats.total}
              color={
                status === "confirmed"
                  ? "#34d399"
                  : status === "canceled" || status === "cancelled"
                    ? "#f87171"
                    : status === "completed"
                      ? "#22d3ee"
                      : "#a78bfa"
              }
            />
          ))}
          {Object.keys(stats.byStatus).length === 0 ? (
            <div style={{ fontSize: 12, color: "#475569" }}>No data.</div>
          ) : null}
        </div>

        <div className="sw-stack">
          <div className="sw-card" style={{ padding: 22 }}>
            <div className="sw-section-title">Recent Activity</div>
            {activity.length > 0 ? activity.map((item, index) => <ActivityItem key={index} {...item} />) : (
              <div style={{ fontSize: 12, color: "#475569" }}>No recent activity.</div>
            )}
          </div>

          <div className="sw-card" style={{ padding: 22 }}>
            <div className="sw-section-title">Operations Snapshot</div>
            <div className="sw-overview-label">Top service</div>
            <div className="sw-overview-value" style={{ fontSize: 20 }}>{stats.topService}</div>
            <div className="sw-overview-sub">Use this to align staffing and product inventory around the most requested service.</div>
          </div>
        </div>
      </div>

      <div className="sw-section-title" style={{ marginTop: 8 }}>Location Overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            loc={location}
            stats={byLocationStats[location.id]}
            active={selected === location.id}
            onSelect={select}
          />
        ))}
      </div>
    </div>
  );
}
