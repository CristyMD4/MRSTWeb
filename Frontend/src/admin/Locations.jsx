import React, { useEffect, useMemo, useState } from "react";
import {
  addStoreItem, deleteStoreItem, listBookings, listLocations,
  updateLocation, updateStoreItem,
} from "../lib/storage";
import { getAdminLocation, setAdminLocation, subscribeAdminLocation } from "../lib/adminLocation";

function calcStats(bookings) {
  let revenue = 0;
  const svcCount = {};
  const byStatus = {};
  for (const b of bookings) {
    const s = b.status || "new";
    byStatus[s] = (byStatus[s] || 0) + 1;
    if (s === "completed") revenue += 35;
    const svc = b.service || "Unknown";
    svcCount[svc] = (svcCount[svc] || 0) + 1;
  }
  return { total: bookings.length, byStatus, revenue, svcCount };
}

function LocationCard({ loc, stats, active, onSelect }) {
  const f = loc.features || {};
  const tags = [
    f.selfWashBoxes && `${f.selfWashBoxes} Self-Wash`,
    f.carWashLanes && `${f.carWashLanes} Car-Wash Lanes`,
    f.hasStore && "Store",
  ].filter(Boolean);

  return (
    <button
      type="button" onClick={() => onSelect(loc.id)}
      style={{
        all: "unset", display: "block", width: "100%", boxSizing: "border-box",
        background: active ? "rgba(34,211,238,0.06)" : "rgba(10,18,32,0.7)",
        border: `1px solid ${active ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.09)"}`,
        borderRadius: 14, padding: "18px 20px",
        cursor: "pointer", transition: "all 0.18s", textAlign: "left",
        boxShadow: active ? "0 0 24px rgba(34,211,238,0.08)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#67e8f9" : "#64748b", fontFamily: "'Syne', sans-serif" }}>
          {loc.name}
        </div>
        {active && (
          <div style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#22d3ee", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.22)",
            borderRadius: 99, padding: "2px 8px", flexShrink: 0
          }}>Active</div>
        )}
      </div>
      {loc.address && <div style={{ fontSize: 11, color: "#334155", marginTop: 3 }}>{loc.address}</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#475569", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99, padding: "2px 8px"
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
        <div>
          <div style={{ fontSize: 8, color: "#1e293b", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Bookings</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#67e8f9", fontFamily: "'Syne', sans-serif" }}>{stats?.total || 0}</div>
        </div>
        <div>
          <div style={{ fontSize: 8, color: "#1e293b", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>Revenue</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399", fontFamily: "'Syne', sans-serif" }}>
            ${(stats?.revenue || 0).toFixed(0)}
          </div>
        </div>
      </div>
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="sw-form-label">{label}</label>
      {children}
    </div>
  );
}

function LocationConfigForm({ location, onSave }) {
  const f = location.features || {};
  const [name, setName] = useState(location.name || "");
  const [address, setAddress] = useState(location.address || "");
  const [selfWashBoxes, setSelfWashBoxes] = useState(String(f.selfWashBoxes ?? 0));
  const [carWashLanes, setCarWashLanes] = useState(String(f.carWashLanes ?? 0));
  const [hasStore, setHasStore] = useState(!!f.hasStore);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name: name.trim() || location.name, address,
      features: { selfWashBoxes: Math.max(0, Number(selfWashBoxes || 0)), carWashLanes: Math.max(0, Number(carWashLanes || 0)), hasStore }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="sw-form-grid" style={{ marginTop: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Name"><input className="sw-input" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Address"><input className="sw-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, city" /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Self-wash boxes"><input className="sw-input" value={selfWashBoxes} onChange={e => setSelfWashBoxes(e.target.value)} inputMode="numeric" /></Field>
        <Field label="Car-wash lanes"><input className="sw-input" value={carWashLanes} onChange={e => setCarWashLanes(e.target.value)} inputMode="numeric" /></Field>
      </div>
      <label className="sw-checkbox-row" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={hasStore} onChange={e => setHasStore(e.target.checked)}
          style={{ accentColor: "#22d3ee" }} />
        Has store (products + wash tokens)
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="sw-btn sw-btn-primary" type="submit">Save Config</button>
        {saved && <span style={{ fontSize: 11, color: "#34d399" }}>✓ Saved</span>}
      </div>
    </form>
  );
}

function StoreManager({ location, onAdd, onToggle, onDelete }) {
  const items = Array.isArray(location.storeItems) ? location.storeItems : [];
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Car care products");
  const [price, setPrice] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, price: Number(price || 0), inStock: true });
    setName(""); setPrice("");
  }

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: "grid", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div className="sw-section-title" style={{ margin: 0 }}>Add Item</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10 }}>
          <input className="sw-input" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" />
          <input className="sw-input" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" inputMode="decimal" />
        </div>
        <select className="sw-input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Car care products">Car care products</option>
          <option value="Wash services">Wash services</option>
        </select>
        <button className="sw-btn sw-btn-primary" type="submit" style={{ justifySelf: "start" }}>Add Item</button>
      </form>

      <div className="sw-card" style={{ overflow: "hidden" }}>
        <table className="sw-table">
          <thead>
            <tr>
              <th>Item</th><th>Category</th><th>Price</th><th>In Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td><strong>{it.name}</strong></td>
                <td>{it.category}</td>
                <td>${Number(it.price || 0).toFixed(2)}</td>
                <td>
                  <input type="checkbox" checked={!!it.inStock} style={{ accentColor: "#22d3ee" }}
                    onChange={e => onToggle(it.id, e.target.checked)} />
                </td>
                <td>
                  <button className="sw-btn sw-btn-danger" type="button" onClick={() => onDelete(it.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "#1e293b", padding: 24 }}>No items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminLocations() {
  const [locRows, setLocRows] = useState(() => listLocations());
  const [selected, setSelected] = useState(() => getAdminLocation());
  useEffect(() => subscribeAdminLocation(setSelected), []);

  const bookings = useMemo(() => listBookings(), []);
  function refresh() { setLocRows(listLocations()); }
  function select(id) { const v = id || "all"; setAdminLocation(v); setSelected(v); }

  const byLocStats = useMemo(() => {
    const res = {};
    for (const l of locRows) res[l.id] = calcStats(bookings.filter(b => (b.locationId || "loc_1") === l.id));
    return res;
  }, [bookings, locRows]);

  const single = selected !== "all" ? locRows.find(l => l.id === selected) : null;

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 className="sw-page-h1">Locations</h1>
          <p className="sw-page-sub">Select a location to manage it, or view all at once</p>
        </div>
        {selected !== "all" && (
          <button className="sw-btn sw-btn-ghost" onClick={() => select("all")}>← All Locations</button>
        )}
      </div>

      {/* Location selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        {/* All button */}
        <button
          type="button" onClick={() => select("all")}
          style={{
            all: "unset", display: "flex", flexDirection: "column", justifyContent: "center",
            width: "100%", boxSizing: "border-box", minHeight: 100,
            background: selected === "all" ? "rgba(34,211,238,0.06)" : "rgba(10,18,32,0.7)",
            border: `1px solid ${selected === "all" ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.09)"}`,
            borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.18s",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: selected === "all" ? "#67e8f9" : "#64748b", fontFamily: "'Syne', sans-serif" }}>All Locations</div>
          <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Combined overview</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#67e8f9", fontFamily: "'Syne', sans-serif", marginTop: 10 }}>
            {bookings.length}
          </div>
          <div style={{ fontSize: 8, color: "#1e293b", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Total bookings</div>
        </button>

        {locRows.map(l => (
          <LocationCard key={l.id} loc={l} stats={byLocStats[l.id]} active={selected === l.id} onSelect={select} />
        ))}
      </div>

      {/* Single location details */}
      {single ? (
        <div>
          <div className="sw-divider" />
          <div className="sw-section-title">{single.name} — Configuration</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="sw-card" style={{ padding: 22 }}>
              <div className="sw-section-title">Station Config</div>
              <LocationConfigForm
                key={single.id} location={single}
                onSave={patch => { updateLocation(single.id, patch); refresh(); }}
              />
            </div>
            <div className="sw-card" style={{ padding: 22 }}>
              <div className="sw-section-title">Store Inventory</div>
              {single.features?.hasStore ? (
                <StoreManager
                  location={single}
                  onAdd={item => { addStoreItem(single.id, item); refresh(); }}
                  onToggle={(itemId, inStock) => { updateStoreItem(single.id, itemId, { inStock }); refresh(); }}
                  onDelete={itemId => { if (!confirm("Delete item?")) return; deleteStoreItem(single.id, itemId); refresh(); }}
                />
              ) : (
                <div style={{ padding: "20px 0", fontSize: 12, color: "#334155", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.06)", textAlign: "center" }}>
                  Store is disabled. Enable it in Station Config above.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : selected === "all" ? (
        <div>
          <div className="sw-divider" />
          <div className="sw-section-title">Per-Location Breakdown</div>
          <div className="sw-card" style={{ overflow: "hidden" }}>
            <table className="sw-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Features</th>
                  <th>Bookings</th>
                  <th>New</th>
                  <th>Completed</th>
                  <th>Revenue (est.)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {locRows.map(l => {
                  const st = byLocStats[l.id];
                  const f = l.features || {};
                  return (
                    <tr key={l.id}>
                      <td><strong>{l.name}</strong>{l.address && <div style={{ fontSize: 10 }}>{l.address}</div>}</td>
                      <td style={{ fontSize: 11 }}>
                        {[f.selfWashBoxes && `${f.selfWashBoxes} self-wash`, f.carWashLanes && `${f.carWashLanes} lanes`, f.hasStore && "store"].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td><strong style={{ color: "#67e8f9" }}>{st.total}</strong></td>
                      <td>{st.byStatus.new || 0}</td>
                      <td>{st.byStatus.completed || 0}</td>
                      <td style={{ color: "#34d399" }}>${st.revenue.toFixed(0)}</td>
                      <td><button className="sw-btn sw-btn-ghost" onClick={() => select(l.id)}>Open →</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
