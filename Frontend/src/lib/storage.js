
// ---------- Keys ----------
const KEYS = {
  bookings: "sw_bookings_v1",
  messages: "sw_messages_v1",
  testimonials: "sw_testimonials_v1",
  locations: "sw_locations_v1",
};

// ---------- Helpers ----------
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "ID") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ---------- Seed ----------
export function seedIfEmpty() {
  const bookings = read(KEYS.bookings, null);
  const messages = read(KEYS.messages, null);
  const testimonials = read(KEYS.testimonials, null);
  const locations = read(KEYS.locations, null);

  if (!Array.isArray(bookings)) write(KEYS.bookings, []);
  if (!Array.isArray(messages)) write(KEYS.messages, []);
  if (!Array.isArray(testimonials)) {
    write(KEYS.testimonials, [
      {
        id: uid("TST"),
        name: "Sarah Johnson",
        role: "Business Owner",
        text: "Amazing service — my car looks brand new every time!",
        approved: true,
        at: Date.now() - 1000 * 60 * 60 * 24 * 10,
      },
      {
        id: uid("TST"),
        name: "Michael Chen",
        role: "Tech Professional",
        text: "Love the self-service bays. Clean, fast, and always available.",
        approved: true,
        at: Date.now() - 1000 * 60 * 60 * 24 * 6,
      },
      {
        id: uid("TST"),
        name: "Emily Rodriguez",
        role: "Marketing Manager",
        text: "Premium detailing exceeded expectations. Worth it.",
        approved: false,
        at: Date.now() - 1000 * 60 * 60 * 24 * 2,
      },
    ]);
  }

  // Locations / car-wash stations
  // Requirement:
  // - Location 1: 4 self-wash boxes
  // - Location 2: 6 self-wash boxes + 2 car-wash lanes
  // - Location 3: 6 self-wash boxes + store (products/services)
  if (!Array.isArray(locations)) {
    write(KEYS.locations, [
      {
        id: "loc_1",
        name: "Location 1",
        address: "",
        features: { selfWashBoxes: 4, carWashLanes: 0, hasStore: false, parkingSpots: 8 },
        storeItems: [],
        at: Date.now(),
      },
      {
        id: "loc_2",
        name: "Location 2",
        address: "",
        features: { selfWashBoxes: 6, carWashLanes: 2, hasStore: false, parkingSpots: 12 },
        storeItems: [],
        at: Date.now(),
      },
      {
        id: "loc_3",
        name: "Location 3",
        address: "",
        features: { selfWashBoxes: 6, carWashLanes: 0, hasStore: true, parkingSpots: 10 },
        storeItems: [
          {
            id: uid("SKU"),
            name: "Microfiber towel",
            category: "Car care products",
            price: 6.5,
            inStock: true,
          },
          {
            id: uid("SKU"),
            name: "Foam shampoo",
            category: "Car care products",
            price: 9.9,
            inStock: true,
          },
          {
            id: uid("SKU"),
            name: "Quick wax",
            category: "Car care products",
            price: 12.0,
            inStock: true,
          },
          {
            id: uid("SKU"),
            name: "Express wash (token)",
            category: "Wash services",
            price: 8.0,
            inStock: true,
          },
        ],
        at: Date.now(),
      },
    ]);
  }
}

// ---------- Messages ----------
export function listMessages() {
  seedIfEmpty();
  return read(KEYS.messages, []).sort((a, b) => (b.at || 0) - (a.at || 0));
}

/**
 * Add a message (Contact page)
 * Expected shape:
 * { id, name, email, phone, message, at, read }
 */
export function addMessage(message) {
  seedIfEmpty();
  const items = read(KEYS.messages, []);

  const msg = {
    id: message?.id || uid("MSG"),
    name: message?.name || "",
    email: message?.email || "",
    phone: message?.phone || "",
    message: message?.message || "",
    at: typeof message?.at === "number" ? message.at : Date.now(),
    read: !!message?.read,
  };

  items.unshift(msg);
  write(KEYS.messages, items);
  return msg;
}

// ✅ alias (some files might import createMessage)
export function createMessage(data) {
  return addMessage(data);
}

export function markMessageRead(id, readState = true) {
  seedIfEmpty();
  const items = read(KEYS.messages, []);
  const next = items.map((m) => (m.id === id ? { ...m, read: !!readState } : m));
  write(KEYS.messages, next);
}

export function deleteMessage(id) {
  seedIfEmpty();
  const items = read(KEYS.messages, []);
  write(KEYS.messages, items.filter((m) => m.id !== id));
}

// ---------- Bookings ----------
export function listBookings() {
  seedIfEmpty();
  return read(KEYS.bookings, []).sort((a, b) => (b.at || 0) - (a.at || 0));
}

export function addBooking(booking) {
  seedIfEmpty();
  const items = read(KEYS.bookings, []);

  // ✅ accept both fullName and name (because some components use "name")
  const fullName = booking?.fullName || booking?.name || "";

  const b = {
    id: booking?.id || uid("BKG"),
    fullName,
    email: booking?.email || "",
    phone: booking?.phone || "",
    vehicle: booking?.vehicle || "",
    service: booking?.service || "",
    locationId: booking?.locationId || "loc_1",
    date: booking?.date || "",
    time: booking?.time || "",
    notes: booking?.notes || "",
    at: typeof booking?.at === "number" ? booking.at : Date.now(),
    status: booking?.status || "new", // new | confirmed | completed | canceled
  };

  items.unshift(b);
  write(KEYS.bookings, items);
  return b;
}

// ---------- Bookings by location + date ----------
export function getBookingsForLocationDate(locationId, date) {
  seedIfEmpty();
  return read(KEYS.bookings, []).filter(
    (b) => b.locationId === locationId && b.date === date && b.service === "Self-Service"
  );
}

// ---------- Locations ----------
export function listLocations() {
  seedIfEmpty();
  return read(KEYS.locations, []).slice();
}

export function getLocation(id) {
  seedIfEmpty();
  return read(KEYS.locations, []).find((l) => l.id === id) || null;
}

export function updateLocation(id, patch) {
  seedIfEmpty();
  const items = read(KEYS.locations, []);
  const next = items.map((l) => (l.id === id ? { ...l, ...patch } : l));
  write(KEYS.locations, next);
}

export function addStoreItem(locationId, item) {
  seedIfEmpty();
  const items = read(KEYS.locations, []);
  const next = items.map((l) => {
    if (l.id !== locationId) return l;
    const storeItems = Array.isArray(l.storeItems) ? l.storeItems : [];
    const it = {
      id: item?.id || uid("SKU"),
      name: item?.name || "",
      category: item?.category || "Car care products",
      price: typeof item?.price === "number" ? item.price : Number(item?.price || 0),
      inStock: item?.inStock ?? true,
    };
    return { ...l, storeItems: [it, ...storeItems] };
  });
  write(KEYS.locations, next);
}

export function updateStoreItem(locationId, itemId, patch) {
  seedIfEmpty();
  const items = read(KEYS.locations, []);
  const next = items.map((l) => {
    if (l.id !== locationId) return l;
    const storeItems = Array.isArray(l.storeItems) ? l.storeItems : [];
    const upd = storeItems.map((it) => (it.id === itemId ? { ...it, ...patch } : it));
    return { ...l, storeItems: upd };
  });
  write(KEYS.locations, next);
}

export function deleteStoreItem(locationId, itemId) {
  seedIfEmpty();
  const items = read(KEYS.locations, []);
  const next = items.map((l) => {
    if (l.id !== locationId) return l;
    const storeItems = Array.isArray(l.storeItems) ? l.storeItems : [];
    return { ...l, storeItems: storeItems.filter((it) => it.id !== itemId) };
  });
  write(KEYS.locations, next);
}

// ✅ alias (your Book.jsx error was: createBooking not exported)
export function createBooking(data) {
  return addBooking(data);
}

export function updateBooking(id, patch) {
  seedIfEmpty();
  const items = read(KEYS.bookings, []);
  const next = items.map((b) => (b.id === id ? { ...b, ...patch } : b));
  write(KEYS.bookings, next);
}

export function deleteBooking(id) {
  seedIfEmpty();
  const items = read(KEYS.bookings, []);
  write(KEYS.bookings, items.filter((b) => b.id !== id));
}

// ---------- Testimonials ----------
export function listTestimonials() {
  seedIfEmpty();
  return read(KEYS.testimonials, []).sort((a, b) => (b.at || 0) - (a.at || 0));
}

export function addTestimonial(testimonial) {
  seedIfEmpty();
  const items = read(KEYS.testimonials, []);

  const t = {
    id: testimonial?.id || uid("TST"),
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    text: testimonial?.text || "",
    approved: !!testimonial?.approved, // admin can approve
    at: typeof testimonial?.at === "number" ? testimonial.at : Date.now(),
  };

  items.unshift(t);
  write(KEYS.testimonials, items);
  return t;
}

export function approveTestimonial(id, approved = true) {
  seedIfEmpty();
  const items = read(KEYS.testimonials, []);
  const next = items.map((t) => (t.id === id ? { ...t, approved: !!approved } : t));
  write(KEYS.testimonials, next);
}

export function updateTestimonial(id, patch) {
  seedIfEmpty();
  const items = read(KEYS.testimonials, []);
  const next = items.map((t) => (t.id === id ? { ...t, ...patch } : t));
  write(KEYS.testimonials, next);
}

export function deleteTestimonial(id) {
  seedIfEmpty();
  const items = read(KEYS.testimonials, []);
  write(KEYS.testimonials, items.filter((t) => t.id !== id));
}
