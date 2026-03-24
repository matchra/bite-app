import { useState } from "react";
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
    <div className="px-6 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-8 mb-6">
        <h1 className="font-display text-[28px] font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* App info */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-card-foreground">What Should I Eat?</p>
              <p className="text-xs text-muted-foreground">v1.1.0</p>
            </div>
            {streak > 0 && (
              <span className="text-xs text-muted-foreground">🔥 {streak}d streak</span>
            )}
          </div>
        </div>

        {/* Notifications */}
        <Section title="Notifications">
          <button onClick={handleNotifToggle} className="w-full flex items-center gap-3 p-3.5 min-h-[48px] active:bg-secondary/50 transition-colors">
            {notifStatus === "granted" ? (
              <Bell className="w-4 h-4 text-success" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Lunch reminders</p>
              <p className="text-xs text-muted-foreground">
                {notifStatus === "granted" ? "Enabled" :
                 notifStatus === "denied" ? "Blocked in browser settings" :
                 notifStatus === "unsupported" ? "Not supported" :
                 "Tap to enable"}
              </p>
            </div>
          </button>
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <SettingsRow icon={Shield} label="Privacy Policy" onClick={() => onNavigate("privacy")} />
          <SettingsRow icon={FileText} label="Terms of Service" onClick={() => onNavigate("terms")} />
          <SettingsRow icon={Mail} label="Contact" onClick={() => onNavigate("contact")} />
        </Section>

        {/* Data */}
        <div className="flex items-center gap-3 px-1">
          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">All data stored locally on your device. No account needed.</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-2">{title}</p>
      <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, onClick }: { icon: typeof Shield; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3.5 min-h-[48px] active:bg-secondary/50 transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="flex-1 text-sm text-card-foreground text-left">{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
    </button>
  );
}
