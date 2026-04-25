import { useState, useCallback } from "react";
import { listProducts, addProduct, updateProduct, deleteProduct } from "../lib/shopStorage";

const CATEGORIES = ["Wash Products", "Car Care"];
const BADGES = ["", "Best Seller", "New", "Sale"];

const EMPTY_FORM = {
  name: "", category: "Wash Products", price: "",
  quantity: "", description: "", badge: "", inStock: true,
};

function uid() {
  return "prod_" + Math.random().toString(36).slice(2, 9);
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function badgeCls(badge) {
  if (badge === "Best Seller") return "sw-badge sw-badge-new";
  if (badge === "New")         return "sw-badge sw-badge-confirmed";
  if (badge === "Sale")        return "sw-badge sw-badge-pending";
  return "";
}

export default function AdminShopProducts() {
  const [products, setProducts] = useState(() => listProducts());
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null); // null | { mode:"add"|"edit", data }
  const [form, setForm]         = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const reload = useCallback(() => setProducts(listProducts()), []);

  const filtered = products.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  function openAdd() {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  }

  function openEdit(p) {
    setForm({
      name: p.name, category: p.category,
      price: String(p.price), quantity: String(p.quantity ?? ""),
      description: p.description || "",
      badge: p.badge || "", inStock: p.inStock ?? true,
    });
    setModal({ mode: "edit", id: p.id });
  }

  function handleSave() {
    if (!form.name.trim() || !form.price) return;
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) return;

    const qty = form.quantity !== "" ? parseInt(form.quantity, 10) : undefined;

    if (modal.mode === "add") {
      const id = slugify(form.name) || uid();
      addProduct({
        id,
        name: form.name.trim(),
        category: form.category,
        price,
        quantity: isNaN(qty) ? 0 : qty,
        description: form.description.trim(),
        badge: form.badge || undefined,
        inStock: form.inStock,
      });
    } else {
      updateProduct(modal.id, {
        name: form.name.trim(),
        category: form.category,
        price,
        quantity: isNaN(qty) ? 0 : qty,
        description: form.description.trim(),
        badge: form.badge || undefined,
        inStock: form.inStock,
      });
    }
    reload();
    setModal(null);
  }

  function handleDelete(id) {
    deleteProduct(id);
    reload();
    setDeleteId(null);
  }

  function toggleStock(id, current) {
    updateProduct(id, { inStock: !current });
    reload();
  }

  const inStock  = products.filter((p) => p.inStock).length;
  const outStock = products.length - inStock;

  return (
    <div>
      {/* Header */}
      <div className="sw-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 className="sw-page-h1">Shop Products</h1>
          <p className="sw-page-sub">Manage the online shop catalogue visible to customers</p>
        </div>
        <button className="sw-btn sw-btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Stats */}
      <div className="sw-stat-grid sw-stat-grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Products", value: products.length },
          { label: "In Stock",       value: inStock,  sub: "available to buy" },
          { label: "Out of Stock",   value: outStock, sub: "hidden from shop" },
          { label: "Categories",     value: CATEGORIES.length },
        ].map((s) => (
          <div key={s.label} className="sw-stat-card">
            <div className="sw-stat-label">{s.label}</div>
            <div className="sw-stat-value">{s.value}</div>
            {s.sub && <div className="sw-stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          className="sw-input"
          style={{ maxWidth: 260 }}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["all", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={"sw-btn " + (filter === c ? "sw-btn-primary" : "sw-btn-ghost")}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="sw-card">
        <table className="sw-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Badge</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "#1e293b", padding: 32 }}>No products found</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)", borderRadius: 5, padding: "2px 6px" }}>
                    #{p.id}
                  </span>
                </td>
                <td>
                  <strong>{p.name}</strong>
                  {p.description && (
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 2, maxWidth: 220 }}
                         className="line-clamp-1">{p.description}</div>
                  )}
                </td>
                <td>{p.category}</td>
                <td><strong>${Number(p.price).toFixed(2)}</strong></td>
                <td>
                  <span style={{ color: (p.quantity ?? 0) <= 5 ? "#f87171" : (p.quantity ?? 0) <= 15 ? "#fbbf24" : "#34d399", fontWeight: 700 }}>
                    {p.quantity ?? 0}
                  </span>
                </td>
                <td>{p.badge ? <span className={badgeCls(p.badge)}>{p.badge}</span> : <span style={{ color: "#1e293b" }}>—</span>}</td>
                <td>
                  <button
                    onClick={() => toggleStock(p.id, p.inStock)}
                    className={"sw-btn " + (p.inStock ? "sw-btn-success" : "sw-btn-ghost")}
                    style={{ height: 28, padding: "0 10px", fontSize: 10 }}
                  >
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sw-btn sw-btn-ghost" style={{ height: 28, padding: "0 10px" }} onClick={() => openEdit(p)}>Edit</button>
                    <button className="sw-btn sw-btn-danger" style={{ height: 28, padding: "0 10px" }} onClick={() => setDeleteId(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="sw-modal-overlay" onClick={() => setModal(null)}>
          <div className="sw-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="sw-modal-title">{modal.mode === "add" ? "Add Product" : "Edit Product"}</h2>
            <div className="sw-form-grid">
              <div>
                <label className="sw-form-label">Product Name *</label>
                <input className="sw-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Foam Shampoo" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="sw-form-label">Category *</label>
                  <select className="sw-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="sw-form-label">Price ($) *</label>
                  <input className="sw-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label className="sw-form-label">Quantity</label>
                  <input className="sw-input" type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="sw-form-label">Description</label>
                <textarea className="sw-textarea" style={{ minHeight: 72 }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short product description..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="sw-form-label">Badge</label>
                  <select className="sw-input" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}>
                    {BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                  <label className="sw-checkbox-row">
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} />
                    In Stock
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="sw-btn sw-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="sw-btn sw-btn-primary" onClick={handleSave}
                disabled={!form.name.trim() || !form.price}>
                {modal.mode === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="sw-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="sw-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <h2 className="sw-modal-title">Delete Product?</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              This will remove the product from the shop permanently.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="sw-btn sw-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sw-btn sw-btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
