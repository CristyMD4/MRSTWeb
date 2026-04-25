const REMINDERS_KEY = "sw_reminders_v1";

function readReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeReminders(list) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
}

export async function requestPermission() {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

function sendNotification(title, body, icon = "/favicon.ico") {
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon });
}

// Notificare imediată de confirmare
export function notifyBookingConfirmed({ name, phone, service, date, time }) {
  sendNotification(
    "✅ Programare confirmată — SparkleWash",
    `${name}, ești programat pentru ${service} pe ${date}${time ? ` la ${time}` : ""}. Nr. telefon: ${phone}`
  );
}

// Planifică reminder cu 2 ore înainte
export function scheduleReminder({ id, name, phone, service, date, time }) {
  if (!date || !time) return; // fără oră nu putem planifica

  const [year, month, day] = date.split("-").map(Number);
  const [hourStr, minutePart] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minutePart, 10);

  // Normalizare AM/PM dacă e cazul
  if (time.toLowerCase().includes("pm") && hour !== 12) hour += 12;
  if (time.toLowerCase().includes("am") && hour === 12) hour = 0;

  const appointmentTime = new Date(year, month - 1, day, hour, minute, 0).getTime();
  const reminderTime = appointmentTime - 2 * 60 * 60 * 1000; // cu 2 ore înainte
  const now = Date.now();

  if (reminderTime <= now) return; // deja trecut

  // Salvează în localStorage pentru persistență
  const reminders = readReminders().filter((r) => r.id !== id);
  reminders.push({ id, name, phone, service, date, time, reminderTime });
  writeReminders(reminders);

  const delay = reminderTime - now;
  setTimeout(() => {
    sendNotification(
      "⏰ Reminder programare — SparkleWash",
      `${name}, ai ${service} în 2 ore (${time}). Nr. telefon: ${phone}`
    );
    // Elimină din lista de remindere
    const updated = readReminders().filter((r) => r.id !== id);
    writeReminders(updated);
  }, delay);
}

// Replanifică reminderele salvate — apelat la încărcarea aplicației
export function restoreReminders() {
  const reminders = readReminders();
  const now = Date.now();
  const still = reminders.filter((r) => r.reminderTime > now);

  still.forEach((r) => {
    const delay = r.reminderTime - now;
    setTimeout(() => {
      sendNotification(
        "⏰ Reminder programare — SparkleWash",
        `${r.name}, ai ${r.service} în 2 ore (${r.time}). Nr. telefon: ${r.phone}`
      );
      const updated = readReminders().filter((x) => x.id !== r.id);
      writeReminders(updated);
    }, delay);
  });

  // Curăță remindere expirate
  writeReminders(still);
}
