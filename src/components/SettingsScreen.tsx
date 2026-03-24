import { useState } from "react";
import { ChevronRight, FileText, Shield, Mail, Info, Bell, BellOff, Sun, Moon, Trash2, Download, Globe } from "lucide-react";
import { getNotificationStatus, requestNotificationPermission } from "@/lib/streak";
import { haptic } from "@/lib/haptics";
import { motion } from "framer-motion";
import appIcon from "@/assets/app-icon-full.png";

interface SettingsScreenProps {
  onNavigate: (page: "privacy" | "terms" | "contact") => void;
  streak: number;
  totalDecided: number;
}

function getTheme(): "light" | "dark" {
  return localStorage.getItem("wsie-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme: "light" | "dark") {
  localStorage.setItem("wsie-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme() {
  const saved = localStorage.getItem("wsie-theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  } else if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("wsie-theme", "dark");
  }
}

export default function SettingsScreen({ onNavigate, streak, totalDecided }: SettingsScreenProps) {
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus);
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const handleResetData = () => {
    haptic("heavy");
    localStorage.removeItem("wsie-saved");
    localStorage.removeItem("wsie-history");
    localStorage.removeItem("wsie-budget");
    localStorage.removeItem("wsie-mood");
    localStorage.removeItem("wsie-prepTime");
    localStorage.removeItem("wsie-mealType");
    localStorage.removeItem("wsie-diets");
    localStorage.removeItem("wsie-streak");
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleExport = async () => {
    haptic("light");
    const data = {
      saved: JSON.parse(localStorage.getItem("wsie-saved") || "[]"),
      history: JSON.parse(localStorage.getItem("wsie-history") || "[]"),
      exportedAt: new Date().toISOString(),
    };
    const text = JSON.stringify(data, null, 2);
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Bite Data", text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {}
    }
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
            <img src={appIcon} alt="Bite" className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <p className="font-display font-bold text-card-foreground">Bite</p>
              <p className="text-xs text-muted-foreground">Version 1.3.0</p>
            </div>
            <div className="flex gap-3 text-right">
              {streak > 0 && (
                <div className="text-center">
                  <p className="text-lg">🔥</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{streak}d</p>
                </div>
              )}
              {totalDecided > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-card-foreground">{totalDecided}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">meals</p>
                </div>
              )}
            </div>
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
              <p className="text-sm text-card-foreground">Daily suggestions</p>
              <p className="text-xs text-muted-foreground">
                {notifStatus === "granted" ? "Enabled — we'll nudge you daily" :
                 notifStatus === "denied" ? "Blocked — enable in browser settings" :
                 notifStatus === "unsupported" ? "Not supported on this device" :
                 "Tap to enable daily meal reminders"}
              </p>
            </div>
            {notifStatus === "default" && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <SectionLabel>Data</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-colors">
            <Download className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Export my meals</p>
              <p className="text-xs text-muted-foreground">Share or save your meal data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            {!showResetConfirm ? (
              <button onClick={() => { haptic("light"); setShowResetConfirm(true); }} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-colors">
                <Trash2 className="w-5 h-5 text-destructive/70" />
                <div className="flex-1 text-left">
                  <p className="text-sm text-destructive/80">Reset all data</p>
                  <p className="text-xs text-muted-foreground">Clear saved meals, history, and preferences</p>
                </div>
              </button>
            ) : (
              <div className="px-4 py-3.5">
                <p className="text-sm text-destructive font-medium mb-2">Are you sure? This can't be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium active:bg-secondary/70 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetData}
                    className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium active:bg-destructive/90 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Info className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-card-foreground">All data stored locally</p>
              <p className="text-xs text-muted-foreground">No account required. Your data stays on your device.</p>
            </div>
          </div>
        </div>

        <SectionLabel>Support</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <button
            onClick={() => {
              haptic("light");
              window.location.href = "mailto:matchragroup@gmail.com?subject=Bite%20App%20Support%20Request&body=%0A%0A---%0ADevice%3A%20" + encodeURIComponent(navigator.userAgent);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] active:bg-muted/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Contact Support</p>
              <p className="text-xs text-muted-foreground">matchragroup@gmail.com</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <SectionLabel>Legal</SectionLabel>
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <SettingsRow icon={Shield} label="Privacy Policy" onClick={() => onNavigate("privacy")} />
          <SettingsRow icon={FileText} label="Terms of Service" onClick={() => onNavigate("terms")} />
          <SettingsRow icon={Globe} label="Website" onClick={() => window.open("https://usebiteapp.com", "_blank")} />
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
