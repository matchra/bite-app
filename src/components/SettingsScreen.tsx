import { useState, useEffect } from "react";
import { ChevronRight, FileText, Shield, Mail, Info, Bell, BellOff } from "lucide-react";
import { getNotificationStatus, requestNotificationPermission } from "@/lib/streak";
import { haptic } from "@/lib/haptics";

interface SettingsScreenProps {
  onNavigate: (page: "privacy" | "terms" | "contact") => void;
  streak: number;
}

export default function SettingsScreen({ onNavigate, streak }: SettingsScreenProps) {
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus);

  const handleNotifToggle = async () => {
    haptic("light");
    if (notifStatus === "granted") return;
    const granted = await requestNotificationPermission();
    setNotifStatus(granted ? "granted" : "denied");
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
              <p className="font-display font-bold text-card-foreground">What Should I Eat?</p>
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
