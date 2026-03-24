import { Home, UtensilsCrossed, Settings } from "lucide-react";

export type Tab = "home" | "myeats" | "settings";

interface BottomTabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  savedCount: number;
}

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "myeats", label: "My Eats", icon: UtensilsCrossed },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomTabBar({ active, onChange, savedCount }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground/60"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.id === "myeats" && savedCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-foreground text-background text-[9px] flex items-center justify-center font-bold">
                    {savedCount > 9 ? "9+" : savedCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
