const STREAK_KEY = "wsie-streak";
const LAST_VISIT_KEY = "wsie-last-visit";

interface StreakData {
  count: number;
  lastDate: string;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastDate: "" };
}

export function updateStreak(): StreakData {
  const today = getToday();
  const yesterday = getYesterday();
  const current = getStreak();

  if (current.lastDate === today) {
    return current; // Already visited today
  }

  let newCount: number;
  if (current.lastDate === yesterday) {
    newCount = current.count + 1; // Continue streak
  } else {
    newCount = 1; // Start new streak
  }

  const updated = { count: newCount, lastDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  localStorage.setItem(LAST_VISIT_KEY, today);
  return updated;
}

export function shouldShowLunchReminder(): boolean {
  const hour = new Date().getHours();
  if (hour < 11 || hour > 13) return false;

  const lastReminder = localStorage.getItem("wsie-last-reminder");
  const today = getToday();
  if (lastReminder === today) return false;

  return true;
}

export function dismissLunchReminder() {
  localStorage.setItem("wsie-last-reminder", getToday());
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

export function getNotificationStatus(): "granted" | "denied" | "default" | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export function sendNotification(title: string, body: string) {
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/pwa-192.png" });
  } catch {}
}
