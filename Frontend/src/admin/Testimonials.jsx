import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { addTestimonial, deleteTestimonial, listTestimonials, uid, updateTestimonial } from "../lib/storage";

function Stars({ n }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? "#f59e0b" : "#1e293b", fontSize: 12 }}>★</span>
      ))}
    </div>
  );
}

export default function AdminTestimonials() {
  const { t } = useTranslation();
  const [rows, setRows] = useState(listTestimonials());
  const [modal, setModal] = useState(null);

  const counts = useMemo(() => ({
    approved: rows.filter(x => x.status === "approved" || x.approved).length,
    pending: rows.filter(x => x.status !== "approved" && !x.approved).length,
  }), [rows]);

  function refresh() { setRows(listTestimonials()); }
  function openAdd() {
    setModal({ mode: "add", item: { id: uid("TST"), name: "", role: "Customer", text: "", rating: 5, status: "pending" } });
  }
  function openEdit(item) { setModal({ mode: "edit", item: { ...item } }); }
  function save() {
    if (!modal) return;
    const it = modal.item;
    if (!it.name.trim() || !it.text.trim()) return alert("Name and text are required");
    if (modal.mode === "add") addTestimonial(it);
    else updateTestimonial(it.id, it);
    setModal(null); refresh();
  }
  function approve(id) { updateTestimonial(id, { status: "approved", approved: true }); refresh(); }
  function remove(id) { if (!confirm("Delete testimonial?")) return; deleteTestimonial(id); refresh(); }

  return (
    <div>
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="sw-page-h1">Testimonials</h1>
          <p className="sw-page-sub">{counts.approved} approved · {counts.pending} pending</p>
        </div>
        <button className="sw-btn sw-btn-primary" onClick={openAdd}>+ Add</button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {rows.map(x => {
          const isApproved = x.status === "approved" || x.approved;
          return (
            <div key={x.id} className="sw-card" style={{
              padding: 22,
              borderColor: isApproved ? "rgba(52,211,153,0.15)" : undefined,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: isApproved ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                      border: `1px solid ${isApproved ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: isApproved ? "#34d399" : "#fbbf24",
                      fontWeight: 700, flexShrink: 0
                    }}>
                      {(x.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{x.name}</div>
                      <div style={{ fontSize: 11, color: "#334155" }}>{x.role}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}><Stars n={x.rating || 5} /></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span className={`sw-badge ${isApproved ? "sw-badge-approved" : "sw-badge-pending"}`}>
                    {isApproved ? "Approved" : "Pending"}
                  </span>
                  {!isApproved && (
                    <button className="sw-btn sw-btn-success" onClick={() => approve(x.id)}>Approve</button>
                  )}
                  <button className="sw-btn sw-btn-ghost" onClick={() => openEdit(x)}>Edit</button>
                  <button className="sw-btn sw-btn-danger" onClick={() => remove(x.id)}>Delete</button>
                </div>
              </div>

              <div style={{
                marginTop: 14, padding: "12px 16px",
                background: "rgba(255,255,255,0.02)", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.04)",
                fontSize: 13, color: "#64748b", lineHeight: 1.7,
                fontStyle: "italic"
              }}>
                "{x.text}"
              </div>
              <div style={{ fontSize: 9, color: "#1e293b", marginTop: 8 }}>{x.id}</div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="sw-card" style={{ padding: 40, textAlign: "center", color: "#1e293b", fontSize: 13 }}>
            No testimonials yet. Add one to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="sw-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="sw-modal">
            <div className="sw-modal-title">
              {modal.mode === "add" ? "Add Testimonial" : "Edit Testimonial"}
            </div>
            <div className="sw-form-grid">
              <div>
                <label className="sw-form-label">Name</label>
                <input className="sw-input" value={modal.item.name}
                  onChange={e => setModal(p => ({ ...p, item: { ...p.item, name: e.target.value } }))}
                  placeholder="Customer name" />
              </div>
              <div>
                <label className="sw-form-label">Role</label>
                <input className="sw-input" value={modal.item.role}
                  onChange={e => setModal(p => ({ ...p, item: { ...p.item, role: e.target.value } }))}
                  placeholder="e.g. Business Owner" />
              </div>
              <div>
                <label className="sw-form-label">Testimonial</label>
                <textarea className="sw-textarea" value={modal.item.text}
                  onChange={e => setModal(p => ({ ...p, item: { ...p.item, text: e.target.value } }))}
                  placeholder="What did they say?" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="sw-form-label">Rating</label>
                  <select className="sw-input" value={modal.item.rating}
                    onChange={e => setModal(p => ({ ...p, item: { ...p.item, rating: Number(e.target.value) } }))}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="sw-form-label">Status</label>
                  <select className="sw-input" value={modal.item.status}
                    onChange={e => setModal(p => ({ ...p, item: { ...p.item, status: e.target.value } }))}>
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button className="sw-btn sw-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="sw-btn sw-btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
