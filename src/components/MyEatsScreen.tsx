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
  if (days === 0) return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days === 1) return `Yesterday at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days < 7) return `${date.toLocaleDateString([], { weekday: "long" })} at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
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

  const totalItems = savedMeals.length + historyEntries.length;

  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">My Eats 🍴</h1>
        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {savedMeals.length} saved · {historyEntries.length} decided
          </p>
        )}
      </div>

      {/* Sub-tab switcher */}
      <div className="flex gap-1 mb-5 bg-secondary rounded-xl p-1">
        <SubTabButton active={subTab === "saved"} onClick={() => { haptic("light"); setSubTab("saved"); }} count={savedMeals.length}>
          ⭐ Saved
        </SubTabButton>
        <SubTabButton active={subTab === "history"} onClick={() => { haptic("light"); setSubTab("history"); }} count={historyEntries.length}>
          📖 History
        </SubTabButton>
        <SubTabButton active={subTab === "grocery"} onClick={() => { haptic("light"); setSubTab("grocery"); }} count={groceryList.length}>
          🛒 List
        </SubTabButton>
      </div>

      <AnimatePresence mode="wait">
        {/* SAVED TAB */}
        {subTab === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
            {savedMeals.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />}
                title="No saves yet"
                subtitle="Bookmark meals you love and they'll show up here."
              />
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {savedMeals.map((meal, i) => (
                    <motion.div
                      key={meal.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -80, scale: 0.9 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
                    >
                      <motion.span className="text-2xl" whileTap={{ scale: 1.3, rotate: 10 }}>
                        {meal.emoji}
                      </motion.span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
                      </div>
                      <button onClick={() => { haptic("light"); onRemoveSaved(meal.id); }} className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors rounded-xl active:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* HISTORY TAB */}
        {subTab === "history" && (
          <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
            {/* Stats card */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-4 mb-4 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Your Food Personality</p>
                </div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <span className="text-3xl">{stats.personality.emoji}</span>
                  <div>
                    <p className="font-display font-bold text-lg text-card-foreground">{stats.personality.label}</p>
                    {stats.topMoodPct > 0 && (
                      <p className="text-xs text-muted-foreground">{stats.topMoodPct}% of your picks are this vibe</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                  <div className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                    <p className="text-lg font-bold text-card-foreground">{stats.totalMeals}</p>
                    <p className="text-[10px] text-muted-foreground">meals decided</p>
                  </div>
                  {stats.topMeal && stats.topMeal.count > 1 && (
                    <div className="flex-1 bg-secondary rounded-xl p-2.5 text-center">
                      <p className="text-lg">{stats.topMeal.emoji}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {stats.topMeal.name} ×{stats.topMeal.count}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {historyEntries.length === 0 ? (
              <EmptyState
                icon={<Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />}
                title="No history yet"
                subtitle={"Tap \"Let's eat!\" on a meal and it'll show up here."}
              />
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => { haptic("light"); onClearHistory(); }}
                    className="text-xs text-muted-foreground active:text-destructive transition-colors px-2 py-1 rounded-lg active:bg-destructive/10"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {historyEntries.map((entry, i) => (
                      <motion.button
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -80, scale: 0.9 }}
                        transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 25 }}
                        onClick={() => { haptic("light"); onRepick(entry.mealId); }}
                        className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 border border-border text-left active:bg-muted/50 transition-colors"
                      >
                        <motion.span className="text-2xl" whileTap={{ scale: 1.3, rotate: 10 }}>
                          {entry.mealEmoji}
                        </motion.span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-card-foreground truncate">{entry.mealName}</p>
                          <p className="text-xs text-muted-foreground truncate">{entry.mealDescription}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-0.5">{formatDate(entry.chosenAt)}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* GROCERY TAB */}
        {subTab === "grocery" && (
          <motion.div key="grocery" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
            {cookMeals.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />}
                title="No cook meals saved"
                subtitle="Save some cook meals to auto-generate a grocery list!"
              />
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {checkedItems.size} of {groceryList.length} items checked
                </p>
                <div className="space-y-1.5">
                  {groceryList.map(({ ingredient, fromMeals }, i) => {
                    const isChecked = checkedItems.has(ingredient);
                    return (
                      <motion.button
                        key={ingredient}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => toggleCheck(ingredient)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isChecked ? "bg-muted/50" : "bg-card border border-border"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked ? "bg-success text-success-foreground" : "border-2 border-border"
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium capitalize transition-all ${isChecked ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                            {ingredient}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            for {fromMeals.join(", ")}
                          </p>
                        </div>
                      </motion.button>
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

function SubTabButton({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="text-center mt-16">
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
        {icon}
      </motion.div>
      <p className="text-foreground font-display font-semibold text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );
}
