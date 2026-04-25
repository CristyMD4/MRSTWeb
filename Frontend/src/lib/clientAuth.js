const SESSION_KEY = "sw_client_session_v1";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5179").replace(/\/+$/, "");

function saveSession(authResponse) {
  const session = {
    id: authResponse.email,
    name: authResponse.fullName,
    fullName: authResponse.fullName,
    email: authResponse.email,
    role: authResponse.role || "Customer",
    token: authResponse.token,
    loggedInAt: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  return text || null;
}

function normalizeError(error) {
  if (typeof error !== "string") {
    return "Unable to connect to the server.";
  }

  if (error === "User already exists.") {
    return "auth.errors.emailExists";
  }

  if (error === "Invalid email or password.") {
    return "auth.errors.invalidCredentials";
  }

  return error;
}

async function postAuth(path, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseApiResponse(response);

    if (!response.ok) {
      return {
        ok: false,
        error: normalizeError(data),
      };
    }

    const session = saveSession(data);

    return {
      ok: true,
      user: session,
      session,
    };
  } catch {
    return {
      ok: false,
      error: "Unable to connect to the server.",
    };
  }
}

export function registerClient({ name, email, password }) {
  return postAuth("register", {
    fullName: name,
    email,
    password,
  });
}

export function loginClient({ email, password }) {
  return postAuth("login", {
    email,
    password,
  });
}

export function logoutClient() {
  localStorage.removeItem(SESSION_KEY);
}

export function getClientSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getClientToken() {
  const session = getClientSession();
  return session?.token || null;
}

export function requireClient() {
  return !!getClientSession();
}