import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, updateQty, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Your cart is empty</h1>
        <p className="text-slate-600 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary h-11 px-8">
          Browse the Shop
        </Link>
      </div>
    );
  }

  function handleCheckout() {
    alert("Thank you for your order! This is a demo — no payment was processed.");
    clearCart();
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => {
            const EMOJI = {
              "foam-shampoo":"🧴","pre-wash-spray":"💦","wheel-cleaner":"⚙️",
              "wash-mitt":"🧤","microfiber-set":"🪢","snow-foam-lance":"❄️",
              "bucket-set":"🪣","drying-aid":"💧","car-wax":"✨",
              "quick-detailer":"🌟","leather-conditioner":"🛋️","interior-dressing":"🖤",
              "glass-cleaner":"🪟","paint-sealant":"🛡️","tire-dressing":"🔘",
              "air-freshener":"🌸","clay-bar":"🧱",
            };
            return (
              <div key={item.id} className="card p-4 sm:p-5">
                {/* Row 1: thumbnail + info + remove */}
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-2xl">
                    {EMOJI[item.id] || "🚗"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.category}</div>
                    <div className="text-[var(--sw-blue)] font-bold text-sm mt-0.5">${item.price.toFixed(2)} each</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-lg"
                    aria-label="Remove item"
                  >×</button>
                </div>
                {/* Row 2: qty + subtotal */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-2 text-slate-700 hover:bg-slate-50 transition font-bold">−</button>
                    <span className="px-3 py-2 font-bold text-slate-900 border-l border-r border-slate-200 min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-2 text-slate-700 hover:bg-slate-50 transition font-bold">+</button>
                  </div>
                  <div className="font-black text-slate-900 text-base">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary panel */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-slate-400">Free shipping on orders over $50</p>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-extrabold text-slate-900 text-base">Total</span>
                <span className="font-black text-xl text-[var(--sw-blue)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary w-full h-12 text-base mb-3"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="btn btn-outline w-full h-11 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
