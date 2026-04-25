const SESSION_KEY = "sw_admin_session_v1";

const ADMIN_USER = {
  email: "admin@sparklewash.com",
  password: "admin123",
  name: "SparkleWash Admin",
};

export function adminLogin(email, password) {
  if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
    return { ok: false, error: "Invalid admin credentials." };
  }

  const session = {
    email: ADMIN_USER.email,
    name: ADMIN_USER.name,
    loggedInAt: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function requireAdmin() {
  return !!getAdminSession();
}

export function adminLogout() {
  localStorage.removeItem(SESSION_KEY);
}
