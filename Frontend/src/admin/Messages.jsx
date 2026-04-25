import React, { useMemo, useState } from "react";
import { deleteMessage, listMessages, markMessageRead } from "../lib/storage";

function fmt(ts) {
  return new Date(ts).toLocaleString();
}

export default function AdminMessages() {
  const [rows, setRows] = useState(listMessages());
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const unread = useMemo(() => rows.filter((message) => !message.read).length, [rows]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows
      .filter((message) => {
        if (filter === "unread") return !message.read;
        if (filter === "read") return message.read;
        return true;
      })
      .filter((message) => {
        if (!normalizedQuery) return true;
        return `${message.name} ${message.email} ${message.phone} ${message.message}`.toLowerCase().includes(normalizedQuery);
      });
  }, [filter, query, rows]);

  function toggleRead(id, readState) {
    markMessageRead(id, readState);
    setRows(listMessages());
  }

  function remove(id) {
    if (!confirm("Delete this message?")) return;
    deleteMessage(id);
    setRows(listMessages());
  }

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="sw-page-h1">Messages</h1>
          <p className="sw-page-sub">{unread} unread · {rows.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "unread", "read"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={filter === value ? "sw-btn sw-btn-primary" : "sw-btn sw-btn-ghost"}
              style={{ textTransform: "capitalize" }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="sw-overview-grid" style={{ marginBottom: 18 }}>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Unread Queue</div>
          <div className="sw-overview-value">{unread}</div>
          <div className="sw-overview-sub">Messages still waiting for a response or triage.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Visible Results</div>
          <div className="sw-overview-value">{filtered.length}</div>
          <div className="sw-overview-sub">Current records after applying inbox filter and search.</div>
        </div>
        <div className="sw-overview-card">
          <div className="sw-overview-label">Inbox Search</div>
          <input
            className="sw-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sender, email, phone, or message..."
            style={{ marginTop: 12 }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((message) => (
          <div
            key={message.id}
            className="sw-card"
            style={{
              padding: 22,
              borderColor: !message.read ? "rgba(167,139,250,0.25)" : undefined,
              background: !message.read ? "rgba(167,139,250,0.04)" : undefined,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(167,139,250,0.1)",
                      border: "1px solid rgba(167,139,250,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      color: "#c4b5fd",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {(message.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{message.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {message.email}
                      {message.phone ? ` · ${message.phone}` : ""}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>{fmt(message.at)} · {message.id}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!message.read ? (
                  <span className="sw-badge sw-badge-pending" style={{ alignSelf: "center" }}>Unread</span>
                ) : null}
                <button className="sw-btn sw-btn-ghost" onClick={() => toggleRead(message.id, !message.read)}>
                  {message.read ? "Mark unread" : "Mark read"}
                </button>
                <button className="sw-btn sw-btn-danger" onClick={() => remove(message.id)}>Delete</button>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: "14px 16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.04)",
                fontSize: 13,
                color: "#94a3b8",
                lineHeight: 1.7,
              }}
            >
              {message.message}
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="sw-btn sw-btn-primary" onClick={() => alert("Reply (demo)")}>
                Reply
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="sw-card sw-empty">No messages match the current filter.</div>
        ) : null}
      </div>
    </div>
  );
}
