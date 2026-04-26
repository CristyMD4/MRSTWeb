import { useState } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../lib/shopStorage";
import { useCart } from "../context/CartContext";

const CATEGORIES = ["All", "Wash Products", "Car Care"];

const PRODUCT_EMOJI = {
  "foam-shampoo": "🧴",
  "pre-wash-spray": "💦",
  "wheel-cleaner": "⚙️",
  "wash-mitt": "🧤",
  "microfiber-set": "🪢",
  "snow-foam-lance": "❄️",
  "bucket-set": "🪣",
  "drying-aid": "💧",
  "car-wax": "✨",
  "quick-detailer": "🌟",
  "leather-conditioner": "🛋️",
  "interior-dressing": "🖤",
  "glass-cleaner": "🪟",
  "paint-sealant": "🛡️",
  "tire-dressing": "🔘",
  "air-freshener": "🌸",
  "clay-bar": "🧱",
};

function badgeClasses(badge) {
  if (badge === "Best Seller") return "bg-amber-100 text-amber-700";
  if (badge === "New") return "bg-emerald-100 text-emerald-700";
  if (badge === "Sale") return "bg-rose-100 text-rose-700";
  return "";
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="card p-6 flex flex-col">
      {/* Image placeholder */}
      <div className="relative h-40 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center mb-4 overflow-hidden">
        <span className="text-5xl">{PRODUCT_EMOJI[product.id] || "🚗"}</span>
        {product.badge && (
          <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${badgeClasses(product.badge)}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        {/* ID + category row */}
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-400 font-medium">{product.category}</div>
          <div className="text-[10px] font-mono text-slate-300 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
            #{product.id}
          </div>
        </div>

        <div className="font-extrabold text-slate-900 leading-tight mb-1">{product.name}</div>
        <div className="text-xl font-black text-[var(--sw-blue)] mb-2">${product.price.toFixed(2)}</div>
        <p className="text-sm text-slate-600 line-clamp-2 flex-1 mb-3">{product.description}</p>

        {/* Quantity */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className={`inline-block h-2 w-2 rounded-full ${
            !product.inStock ? "bg-rose-400" : (product.quantity ?? 0) <= 10 ? "bg-amber-400" : "bg-emerald-400"
          }`} />
          <span className="text-xs text-slate-500">
            {!product.inStock
              ? "Out of stock"
              : (product.quantity ?? 0) <= 0
              ? "Out of stock"
              : `${product.quantity} in stock`}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={handleAdd}
            disabled={!product.inStock || (product.quantity ?? 0) <= 0}
            className={`btn flex-1 h-10 text-sm ${added ? "btn-outline text-emerald-700 border-emerald-300" : "btn-primary"} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
          <Link
            to={`/shop/${product.id}`}
            className="btn btn-outline h-10 px-4 text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const allProducts = listProducts();

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="container-page py-8 md:py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-[var(--sw-blue)] mb-4">
          <span>🛒</span> SparkleWash Store
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Shop</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Professional-grade car care products — everything you need to keep your car looking showroom fresh.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat
                ? "bg-[var(--sw-blue)] text-white border-[var(--sw-blue)]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-400">{filtered.length} products</span>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
