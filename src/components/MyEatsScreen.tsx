import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/data/meals";
import { Trash2, UtensilsCrossed, ShoppingCart, Check, Clock, ChevronRight, Sparkles } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { HistoryEntry } from "@/components/HistoryScreen";

interface MyEatsScreenProps {
  savedMeals: Meal[];
  historyEntries: HistoryEntry[];
  onRemoveSaved: (id: string) => void;
  onClearHistory: () => void;
  onRepick: (mealId: string) => void;
}

type SubTab = "saved" | "history" | "grocery";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days === 1) return `Yesterday`;
  if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function computeStats(entries: HistoryEntry[]) {
  if (entries.length < 3) return null;
  const mealCounts = new Map<string, { name: string; emoji: string; count: number }>();
  entries.forEach((e) => {
    const existing = mealCounts.get(e.mealId);
    if (existing) existing.count++;
    else mealCounts.set(e.mealId, { name: e.mealName, emoji: e.mealEmoji, count: 1 });
  });
  const topMeal = [...mealCounts.values()].sort((a, b) => b.count - a.count)[0];
  const moodCounts = new Map<string, number>();
  entries.forEach((e) => {
    if (e.mealMood) moodCounts.set(e.mealMood, (moodCounts.get(e.mealMood) || 0) + 1);
  });
  const topMood = [...moodCounts.entries()].sort(([, a], [, b]) => b - a)[0];
  const personalities: Record<string, { label: string; emoji: string }> = {
    comfort: { label: "Comfort Creature", emoji: "🛋️" },
    quick: { label: "Speed Eater", emoji: "⚡" },
    healthy: { label: "Health Nut", emoji: "🥬" },
    "high-protein": { label: "Gym Bro", emoji: "💪" },
    any: { label: "Wildcard", emoji: "🎲" },
  };
  const personality = topMood ? personalities[topMood[0]] || { label: "Foodie", emoji: "🍽️" } : { label: "Explorer", emoji: "🧭" };
  const topMoodPct = topMood ? Math.round((topMood[1] / entries.length) * 100) : 0;
  return { topMeal, personality, topMoodPct, totalMeals: entries.length };
}

export default function MyEatsScreen({ savedMeals, historyEntries, onRemoveSaved, onClearHistory, onRepick }: MyEatsScreenProps) {
  const [subTab, setSubTab] = useState<SubTab>("saved");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const cookMeals = savedMeals.filter((m) => m.type === "cook" && m.ingredients.length > 0);
  const stats = computeStats(historyEntries);

  const groceryList = useMemo(() => {
    const map = new Map<string, string[]>();
    cookMeals.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        const key = ing.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key)!.includes(meal.name)) map.get(key)!.push(meal.name);
      });
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ingredient, fromMeals]) => ({ ingredient, fromMeals }));
  }, [cookMeals]);

  const toggleCheck = (item: string) => {
    haptic("light");
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <div className="px-6 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-8 mb-6">
        <h1 className="font-display text-[28px] font-bold text-foreground">My Eats</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {savedMeals.length} saved · {historyEntries.length} decided
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-0.5">
        {([
          { id: "saved" as const, label: "Saved" },
          { id: "history" as const, label: "History" },
          { id: "grocery" as const, label: "List" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { haptic("light"); setSubTab(tab.id); }}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all min-h-[36px] ${
              subTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {subTab === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {savedMeals.length === 0 ? (
              <EmptyState icon="⭐" title="No saves yet" subtitle="Bookmark meals and they'll appear here." />
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {savedMeals.map((meal, i) => (
                    <motion.div
                      key={meal.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border"
                    >
                      <span className="text-xl">{meal.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-card-foreground truncate">{meal.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
                      </div>
                      <button onClick={() => { haptic("light"); onRemoveSaved(meal.id); }} className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {subTab === "history" && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {stats && (
              <div className="bg-card rounded-xl border border-border p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stats.personality.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{stats.personality.label}</p>
                    <p className="text-xs text-muted-foreground">{stats.totalMeals} meals · {stats.topMoodPct}% {stats.personality.label.toLowerCase()} vibes</p>
                  </div>
                </div>
              </div>
            )}

            {historyEntries.length === 0 ? (
              <EmptyState icon="📖" title="No history yet" subtitle="Your meal decisions will show up here." />
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <button onClick={() => { haptic("light"); onClearHistory(); }} className="text-xs text-muted-foreground active:text-destructive transition-colors px-2 py-1">
                    Clear
                  </button>
                </div>
                <div className="space-y-1.5">
                  {historyEntries.map((entry, i) => (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => { haptic("light"); onRepick(entry.mealId); }}
                      className="w-full flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border text-left active:bg-secondary/50 transition-colors"
                    >
                      <span className="text-lg">{entry.mealEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-card-foreground truncate">{entry.mealName}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDate(entry.chosenAt)}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {subTab === "grocery" && (
          <motion.div key="grocery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {cookMeals.length === 0 ? (
              <EmptyState icon="🛒" title="No grocery list" subtitle="Save cook meals to generate a list." />
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {checkedItems.size}/{groceryList.length} checked
                </p>
                <div className="space-y-1">
                  {groceryList.map(({ ingredient, fromMeals }, i) => {
                    const isChecked = checkedItems.has(ingredient);
                    return (
                      <button
                        key={ingredient}
                        onClick={() => toggleCheck(ingredient)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                          isChecked ? "opacity-50" : "bg-card border border-border"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked ? "bg-foreground" : "border border-border"
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-background" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm capitalize ${isChecked ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                            {ingredient}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{fromMeals.join(", ")}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mt-20">
      <span className="text-4xl block mb-4">{icon}</span>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-[220px] mx-auto">{subtitle}</p>
    </div>
  );
}
