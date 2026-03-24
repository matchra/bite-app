import { ChevronRight, FileText, Shield, Mail, Info } from "lucide-react";

interface SettingsScreenProps {
  onNavigate: (page: "privacy" | "terms" | "contact") => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
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
            <div>
              <p className="font-display font-bold text-card-foreground">What Should I Eat?</p>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
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
