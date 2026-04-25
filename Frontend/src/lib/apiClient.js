import { getClientSession, logoutClient } from "./clientAuth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5179").replace(/\/+$/, "");

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiFetch(path, options = {}) {
  const session = getClientSession();
  const token = session?.token;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...Object.fromEntries(new Headers(options.headers || {})),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await parseResponse(response);

  if (response.status === 401) {
    logoutClient();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(typeof data === "string" ? data : "Request failed");
  }

  return data;
}
