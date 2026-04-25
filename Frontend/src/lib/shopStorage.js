const PRODUCTS_KEY = "sw_shop_products_v1";

const DEFAULT_PRODUCTS = [
  { id: "foam-shampoo",       name: "Foam Shampoo",             category: "Wash Products", price: 9.90,  quantity: 50,  description: "High-foaming pH-neutral shampoo for safe hand washing.",              inStock: true },
  { id: "pre-wash-spray",     name: "Pre-Wash Spray",           category: "Wash Products", price: 12.00, quantity: 35,  description: "Loosens dirt and grime before contact wash.",                        badge: "Best Seller", inStock: true },
  { id: "wheel-cleaner",      name: "Wheel Cleaner",            category: "Wash Products", price: 14.50, quantity: 28,  description: "Acid-free formula dissolves brake dust and road grime.",             inStock: true },
  { id: "wash-mitt",          name: "Microfiber Wash Mitt",     category: "Wash Products", price: 8.00,  quantity: 60,  description: "Ultra-soft mitt that won't scratch your paint.",                    inStock: true },
  { id: "microfiber-set",     name: "Microfiber Towel Set (6 pcs)", category: "Wash Products", price: 18.00, quantity: 40, description: "Premium 400gsm towels for drying and buffing.",              badge: "Best Seller", inStock: true },
  { id: "snow-foam-lance",    name: "Snow Foam Lance",          category: "Wash Products", price: 35.00, quantity: 15,  description: "Attaches to any pressure washer for thick foam coverage.",           badge: "New", inStock: true },
  { id: "bucket-set",         name: "Wash Bucket Set",          category: "Wash Products", price: 22.00, quantity: 20,  description: "Two-bucket method set with grit guards included.",                  inStock: true },
  { id: "drying-aid",         name: "Drying Aid Spray",         category: "Wash Products", price: 11.00, quantity: 45,  description: "Speeds up drying and adds slick protection.",                      inStock: true },
  { id: "car-wax",            name: "Carnauba Wax",             category: "Car Care",      price: 24.00, quantity: 30,  description: "Natural carnauba wax for deep shine and 6-week protection.",       badge: "Best Seller", inStock: true },
  { id: "quick-detailer",     name: "Quick Detailer Spray",     category: "Car Care",      price: 15.00, quantity: 38,  description: "Instant gloss boost and dust removal between washes.",             inStock: true },
  { id: "leather-conditioner",name: "Leather Conditioner",      category: "Car Care",      price: 19.00, quantity: 22,  description: "Nourishes and protects leather seats from cracking.",              inStock: true },
  { id: "interior-dressing",  name: "Interior Dressing",        category: "Car Care",      price: 11.00, quantity: 33,  description: "Matte finish for dashboards, trim and plastics.",                  inStock: true },
  { id: "glass-cleaner",      name: "Glass Cleaner",            category: "Car Care",      price: 8.50,  quantity: 55,  description: "Streak-free formula for crystal-clear windows.",                   inStock: true },
  { id: "paint-sealant",      name: "Paint Sealant",            category: "Car Care",      price: 45.00, quantity: 10,  description: "Synthetic sealant — up to 6 months paint protection.",             badge: "New", inStock: true },
  { id: "tire-dressing",      name: "Tire Dressing Gel",        category: "Car Care",      price: 12.00, quantity: 42,  description: "Long-lasting gloss for tyres without sling.",                      inStock: true },
  { id: "air-freshener",      name: "Car Air Freshener",        category: "Car Care",      price: 6.00,  quantity: 70,  description: "Premium scent diffuser for a clean, fresh cabin.",                 inStock: true },
  { id: "clay-bar",           name: "Clay Bar Kit",             category: "Car Care",      price: 28.00, quantity: 18,  description: "Removes bonded contaminants for a smooth-as-glass finish.",        inStock: true },
];

function readProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Seed defaults on first load
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function writeProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function listProducts() {
  return readProducts();
}

export function getProduct(id) {
  return readProducts().find((p) => p.id === id) || null;
}

export function getProductsByCategory(category) {
  return readProducts().filter((p) => p.category === category);
}

export function addProduct(product) {
  const products = readProducts();
  products.push(product);
  writeProducts(products);
}

export function updateProduct(id, changes) {
  const products = readProducts().map((p) => p.id === id ? { ...p, ...changes } : p);
  writeProducts(products);
}

export function deleteProduct(id) {
  writeProducts(readProducts().filter((p) => p.id !== id));
}

// Cart — localStorage key
const CART_KEY = "sw_cart_v1";

function readRaw() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRaw(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCart() {
  return readRaw();
}

export function addToCart(id) {
  const cart = readRaw();
  const existing = cart.find((x) => x.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  writeRaw(cart);
}

export function removeFromCart(id) {
  writeRaw(readRaw().filter((x) => x.id !== id));
}

export function updateQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  const cart = readRaw();
  const existing = cart.find((x) => x.id === id);
  if (existing) {
    existing.quantity = qty;
    writeRaw(cart);
  }
}

export function clearCart() {
  writeRaw([]);
}

export function getCartCount() {
  return readRaw().reduce((sum, x) => sum + x.quantity, 0);
}
