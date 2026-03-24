import { useState, useEffect } from "react";
import { ChevronRight, FileText, Shield, Mail, Info, Bell, BellOff, Sun, Moon } from "lucide-react";
import { getNotificationStatus, requestNotificationPermission } from "@/lib/streak";
import { haptic } from "@/lib/haptics";
import { motion } from "framer-motion";

interface SettingsScreenProps {
  onNavigate: (page: "privacy" | "terms" | "contact") => void;
  streak: number;
}

function getTheme(): "light" | "dark" {
  return localStorage.getItem("wsie-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme: "light" | "dark") {
  localStorage.setItem("wsie-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Apply theme on load (called in main.tsx too)
export function initTheme() {
  const saved = localStorage.getItem("wsie-theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  } else if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("wsie-theme", "dark");
  }
}

export default function SettingsScreen({ onNavigate, streak }: SettingsScreenProps) {
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus);
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme);

  const handleNotifToggle = async () => {
    haptic("light");
    if (notifStatus === "granted") return;
    const granted = await requestNotificationPermission();
    setNotifStatus(granted ? "granted" : "denied");
  };

  const toggleTheme = () => {
    haptic("light");
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    setTheme(next);
  };

  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-3">
        <SectionLabel>About</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="text-3xl">🍽️</div>
            <div className="flex-1">
              <p className="font-display font-bold text-card-foreground">Bite</p>
              <p className="text-xs text-muted-foreground">Version 1.1.0</p>
            </div>
            {streak > 0 && (
              <div className="text-right">
                <p className="text-lg">🔥</p>
                <p className="text-[10px] text-muted-foreground font-medium">{streak} day{streak !== 1 ? "s" : ""}</p>
              </div>
            )}
          </div>
        </div>

        <SectionLabel>Appearance</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-all duration-200">
            <motion.div
              key={theme}
              initial={{ rotate: -30, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </motion.div>
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">{theme === "light" ? "Light mode" : "Dark mode"}</p>
            </div>
            <div className="w-12 h-7 rounded-full bg-secondary p-0.5 transition-colors duration-200">
              <motion.div
                className="w-6 h-6 rounded-full bg-primary shadow-md"
                animate={{ x: theme === "dark" ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </div>
          </button>
        </div>

        <SectionLabel>Notifications</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button onClick={handleNotifToggle} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-colors">
            {notifStatus === "granted" ? (
              <Bell className="w-5 h-5 text-success" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Lunch reminders</p>
              <p className="text-xs text-muted-foreground">
                {notifStatus === "granted" ? "Enabled — we'll nudge you at lunch" :
                 notifStatus === "denied" ? "Blocked — enable in browser settings" :
                 notifStatus === "unsupported" ? "Not supported on this device" :
                 "Tap to enable reminders"}
              </p>
            </div>
            {notifStatus === "default" && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <SectionLabel>Legal</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <SettingsRow icon={Shield} label="Privacy Policy" onClick={() => onNavigate("privacy")} />
          <SettingsRow icon={FileText} label="Terms of Service" onClick={() => onNavigate("terms")} />
          <SettingsRow icon={Mail} label="Contact & Support" onClick={() => onNavigate("contact")} />
        </div>

        <SectionLabel>Data</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Info className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-card-foreground">All data stored locally</p>
              <p className="text-xs text-muted-foreground">No account required. Your data stays on your device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-3">{children}</p>;
}

function SettingsRow({ icon: Icon, label, onClick }: { icon: typeof Shield; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-colors">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="flex-1 text-sm text-card-foreground text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
