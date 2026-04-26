import { apiFetch } from "./apiClient";
import { getClientSession } from "./clientAuth";
import { addBooking, listBookings, updateBooking } from "./storage";

function toQueryString(query = {}) {
  const params = new URLSearchParams();
  if (query.email) params.set("email", query.email);
  const value = params.toString();
  return value ? `?${value}` : "";
}

function localBookings(query = {}) {
  const items = listBookings();
  if (!query.email) return items;
  return items.filter((booking) => (booking.email || "").toLowerCase() === query.email?.toLowerCase());
}

export async function getBookings(query = {}) {
  try {
    return await apiFetch(`/api/Bookings${toQueryString(query)}`);
  } catch {
    return localBookings(query);
  }
}

export async function getMyBookings() {
  const session = getClientSession();
  return getBookings({ email: session?.email || undefined });
}

export async function createBooking(payload) {
  try {
    return await apiFetch("/api/Bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    return addBooking(payload);
  }
}

export async function cancelBooking(id) {
  try {
    return await apiFetch(`/api/Bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "canceled" }),
    });
  } catch {
    updateBooking(id, { status: "canceled" });
    const items = listBookings();
    return items.find((booking) => booking.id === id) || null;
  }
}
