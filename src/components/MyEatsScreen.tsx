import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/data/meals";
import { Trash2, UtensilsCrossed, ShoppingCart, Check, Clock, ChevronRight, Sparkles, Share2 } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { HistoryEntry } from "@/components/HistoryScreen";
import NativeAd from "@/components/NativeAd";

interface MyEatsScreenProps {
  savedMeals: Meal[];
  historyEntries: HistoryEntry[];
  onRemoveSaved: (id: string) => void;
  onClearHistory: () => void;
  onRepick: (mealId: string) => void;
}

type SubTab = "saved" | "history" | "grocery";
type SavedFilter = "all" | "quick" | "cheap" | "healthy" | "protein";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  if (days === 1) return `Yesterday`;
  if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const PERSONALITIES: Record<string, { label: string; emoji: string; desc: string }> = {
  comfort: { label: "Comfort Craver", emoji: "🛋️", desc: "You go for the warm, cozy, soul-hugging meals" },
  quick: { label: "Speed Eater", emoji: "⚡", desc: "No time to waste — you eat fast and move on" },
  healthy: { label: "Health Nut", emoji: "🥬", desc: "Clean eating is your love language" },
  "high-protein": { label: "Gym Bro", emoji: "💪", desc: "Gains first, everything else second" },
  any: { label: "Wildcard", emoji: "🎲", desc: "You're unpredictable and we love it" },
};

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

  // Budget tracking
  const budgetCounts = new Map<string, number>();
  // We can infer personality from moods
  const personality = topMood ? PERSONALITIES[topMood[0]] || { label: "Foodie", emoji: "🍽️", desc: "You appreciate all kinds of food" } : { label: "Explorer", emoji: "🧭", desc: "Still discovering your food identity" };
  const topMoodPct = topMood ? Math.round((topMood[1] / entries.length) * 100) : 0;

  // Unique meals count
  const uniqueMeals = new Set(entries.map(e => e.mealId)).size;

  return { topMeal, personality, topMoodPct, totalMeals: entries.length, uniqueMeals };
}

export default function MyEatsScreen({ savedMeals, historyEntries, onRemoveSaved, onClearHistory, onRepick }: MyEatsScreenProps) {
  const [subTab, setSubTab] = useState<SubTab>("saved");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [savedFilter, setSavedFilter] = useState<SavedFilter>("all");

  const cookMeals = savedMeals.filter((m) => m.type === "cook" && m.ingredients.length > 0);
  const stats = computeStats(historyEntries);

  // Filter saved meals
  const filteredSaved = useMemo(() => {
    if (savedFilter === "all") return savedMeals;
    return savedMeals.filter((m) => {
      switch (savedFilter) {
        case "quick": return m.prepTime === "5";
        case "cheap": return m.budget === "$";
        case "healthy": return m.moods.includes("healthy");
        case "protein": return m.moods.includes("high-protein") || m.tags.includes("high-protein");
        default: return true;
      }
    });
  }, [savedMeals, savedFilter]);

  // Group grocery items by recipe
  const groceryByRecipe = useMemo(() => {
    return cookMeals.map(meal => ({
      meal,
      ingredients: meal.ingredients.map(ing => ({
        name: ing,
        checked: checkedItems.has(`${meal.id}-${ing}`),
        key: `${meal.id}-${ing}`,
      }))
    }));
  }, [cookMeals, checkedItems]);

  const totalGroceryItems = groceryByRecipe.reduce((acc, r) => acc + r.ingredients.length, 0);
  const checkedCount = groceryByRecipe.reduce((acc, r) => acc + r.ingredients.filter(i => i.checked).length, 0);

  const toggleCheck = (key: string) => {
    haptic("light");
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSharePersonality = async () => {
    haptic("light");
    if (!stats) return;
    const text = `My food personality is ${stats.personality.emoji} ${stats.personality.label}!\n${stats.personality.desc}\n\n${stats.totalMeals} meals decided with Bite 🍽️`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Food Personality", text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
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
        <SubTabButton active={subTab === "saved"} onClick={() => { haptic("light"); setSubTab("saved"); }}>
          ⭐ Saved
        </SubTabButton>
        <SubTabButton active={subTab === "history"} onClick={() => { haptic("light"); setSubTab("history"); }}>
          📖 History
        </SubTabButton>
        <SubTabButton active={subTab === "grocery"} onClick={() => { haptic("light"); setSubTab("grocery"); }}>
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
                subtitle="Bookmark meals you love and they'll show up here. Tap 🔖 on any result!"
              />
            ) : (
              <>
                {/* Filter chips */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                  {([
                    { value: "all" as const, label: "All" },
                    { value: "quick" as const, label: "⚡ Quick" },
                    { value: "cheap" as const, label: "💵 Cheap" },
                    { value: "healthy" as const, label: "🥬 Healthy" },
                    { value: "protein" as const, label: "💪 Protein" },
                  ]).map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { haptic("light"); setSavedFilter(f.value); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                        savedFilter === f.value
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {filteredSaved.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center mt-8">No meals match this filter.</p>
                ) : (
                  <div className="space-y-2.5">
                    <AnimatePresence mode="popLayout">
                      {filteredSaved.map((meal, i) => (
                        <motion.div
                          key={meal.id}
                          layout
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -80, scale: 0.9 }}
                          transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                          className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
                        >
                          <motion.button
                            className="text-2xl"
                            whileTap={{ scale: 1.3, rotate: 10 }}
                            onClick={() => { haptic("light"); onRepick(meal.id); }}
                          >
                            {meal.emoji}
                          </motion.button>
                          <button
                            className="flex-1 min-w-0 text-left"
                            onClick={() => { haptic("light"); onRepick(meal.id); }}
                          >
                            <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
                          </button>
                          <button onClick={() => { haptic("light"); onRemoveSaved(meal.id); }} className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors rounded-xl active:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
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
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Your Food Personality</p>
                  </div>
                  <button onClick={handleSharePersonality} className="p-1.5 rounded-lg active:bg-muted/50 transition-colors">
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <span className="text-3xl">{stats.personality.emoji}</span>
                  <div>
                    <p className="font-display font-bold text-lg text-card-foreground">{stats.personality.label}</p>
                    <p className="text-xs text-muted-foreground">{stats.personality.desc}</p>
                  </div>
                </div>
                {stats.topMoodPct > 0 && (
                  <p className="text-[10px] text-muted-foreground/70 mb-3 relative z-10">{stats.topMoodPct}% of your picks are this vibe</p>
                )}
                <div className="flex gap-2 relative z-10">
                  <StatBubble value={stats.totalMeals.toString()} label="decided" />
                  <StatBubble value={stats.uniqueMeals.toString()} label="unique" />
                  {stats.topMeal && stats.topMeal.count > 1 && (
                    <div className="flex-1 bg-secondary rounded-xl p-2 text-center">
                      <p className="text-base">{stats.topMeal.emoji}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        ×{stats.topMeal.count}
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
                subtitle="Complete a meal decision and it'll show up here."
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
                        <span className="text-2xl">{entry.mealEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-card-foreground truncate">{entry.mealName}</p>
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

        {/* GROCERY TAB - grouped by recipe */}
        {subTab === "grocery" && (
          <motion.div key="grocery" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
            {cookMeals.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />}
                title="No cook meals saved"
                subtitle="Save some cook meals to auto-generate a grocery checklist!"
              />
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-4">
                  {checkedCount} of {totalGroceryItems} items checked
                </p>
                <div className="space-y-4">
                  {groceryByRecipe.map(({ meal, ingredients }) => (
                    <div key={meal.id}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>{meal.emoji}</span> {meal.name}
                      </p>
                      <div className="space-y-1">
                        {ingredients.map(({ name, checked, key }) => (
                          <motion.button
                            key={key}
                            onClick={() => toggleCheck(key)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                              checked ? "bg-muted/50" : "bg-card border border-border"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                              checked ? "bg-success text-success-foreground" : "border-2 border-border"
                            }`}>
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                            <p className={`text-sm font-medium capitalize transition-all ${checked ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                              {name}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBubble({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 bg-secondary rounded-xl p-2 text-center">
      <p className="text-base font-bold text-card-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SubTabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
