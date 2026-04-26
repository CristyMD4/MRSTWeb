import { createContext, useCallback, useContext, useState } from "react";
import {
  getCart,
  addToCart as storageAdd,
  removeFromCart as storageRemove,
  updateQty as storageUpdate,
  clearCart as storageClear,
  listProducts,
} from "../lib/shopStorage";

const CartCtx = createContext(null);

function enrichCart(rawCart) {
  const products = listProducts();

  return rawCart
    .map(({ id, quantity }) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);
}

export function CartProvider({ children }) {
  const [raw, setRaw] = useState(() => getCart());

  const refresh = useCallback(() => setRaw(getCart()), []);

  const addToCart = useCallback((id) => {
    storageAdd(id);
    refresh();
  }, [refresh]);

  const removeFromCart = useCallback((id) => {
    storageRemove(id);
    refresh();
  }, [refresh]);

  const updateQty = useCallback((id, qty) => {
    storageUpdate(id, qty);
    refresh();
  }, [refresh]);

  const clearCart = useCallback(() => {
    storageClear();
    refresh();
  }, [refresh]);

  const cartItems = enrichCart(raw);
  const cartCount = raw.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartCtx.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const context = useContext(CartCtx);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
