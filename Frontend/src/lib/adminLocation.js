const KEY = "sw_admin_location_v1";

export function getAdminLocation() {
  try {
    const v = localStorage.getItem(KEY);
    return v || "all";
  } catch {
    return "all";
  }
}

export function setAdminLocation(id) {
  try {
    localStorage.setItem(KEY, id || "all");
  } catch {
    // ignore
  }
}

export function subscribeAdminLocation(cb) {
  // React can use this to stay in sync across tabs.
  const onStorage = (e) => {
    if (e.key === KEY) cb(getAdminLocation());
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
