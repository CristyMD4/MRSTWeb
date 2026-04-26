import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProduct, listProducts } from "../lib/shopStorage";
import { useCart } from "../context/CartContext";

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

const CATEGORY_FEATURES = {
  "Wash Products": [
    "Safe for all paint types and clear coats",
    "pH-balanced formula to protect surfaces",
    "Streak-free rinse for a spotless finish",
    "Compatible with foam guns and pressure washers",
  ],
  "Car Care": [
    "Long-lasting protection against UV, dirt and moisture",
    "Professional-grade formula used by detailers",
    "Easy application — no buffing machines required",
    "Enhances gloss and deepens paint colour",
  ],
};

function badgeClasses(badge) {
  if (badge === "Best Seller") return "bg-amber-100 text-amber-700";
  if (badge === "New") return "bg-emerald-100 text-emerald-700";
  if (badge === "Sale") return "bg-rose-100 text-rose-700";
  return "";
}

export default function ShopProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return listProducts()
      .filter((p) => p.category === product.category && p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-xl text-slate-600 mb-6">Product not found.</p>
        <Link to="/shop" className="btn btn-primary">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addToCart(product.id);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const features = CATEGORY_FEATURES[product.category] || [];

  return (
    <div className="container-page py-12">
      {/* Back link */}
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition mb-8">
        ← Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-10 mb-14">
        {/* Image placeholder */}
        <div className="w-full md:w-80 md:flex-shrink-0 h-64 md:h-80 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
          <span className="text-8xl">{PRODUCT_EMOJI[product.id] || "🚗"}</span>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {product.badge && (
            <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3 ${badgeClasses(product.badge)}`}>
              {product.badge}
            </span>
          )}
          <div className="text-sm text-slate-400 font-medium mb-1">{product.category}</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{product.name}</h1>
          <div className="text-4xl font-black text-[var(--sw-blue)] mb-4">${product.price.toFixed(2)}</div>
          <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div className="card p-5 mb-6">
            <div className="font-extrabold text-slate-800 mb-3">What's included / Features</div>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-[var(--sw-blue)] flex-shrink-0 mt-1" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-lg font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                −
              </button>
              <span className="px-5 py-2.5 font-bold text-slate-900 border-l border-r border-slate-200 min-w-[3rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2.5 text-lg font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                +
              </button>
            </div>
            <span className="text-sm text-slate-400">in stock</span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className={`btn h-12 text-base w-full ${added ? "btn-outline text-emerald-700 border-emerald-300" : "btn-primary"}`}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="card p-5 flex flex-col hover:shadow-lg transition group"
              >
                <div className="h-28 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center mb-3">
                  <span className="text-4xl">{PRODUCT_EMOJI[p.id] || "🚗"}</span>
                </div>
                <div className="font-extrabold text-slate-900 group-hover:text-[var(--sw-blue)] transition mb-1">{p.name}</div>
                <div className="text-lg font-black text-[var(--sw-blue)]">${p.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
