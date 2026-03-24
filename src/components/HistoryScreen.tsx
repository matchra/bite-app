import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, Sparkles } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { Meal } from "@/data/meals";

export interface HistoryEntry {
  id: string;
  mealId: string;
  mealName: string;
  mealEmoji: string;
  mealDescription: string;
  mealMood?: string;
  chosenAt: string; // ISO date string
}

interface HistoryScreenProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onRepick: (mealId: string) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (days === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (days < 7) {
    return `${date.toLocaleDateString([], { weekday: "long" })} at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

// Fun stats computation
function computeStats(entries: HistoryEntry[]) {
  if (entries.length < 3) return null;

  // Most picked meal
  const mealCounts = new Map<string, { name: string; emoji: string; count: number }>();
  entries.forEach((e) => {
    const existing = mealCounts.get(e.mealId);
    if (existing) existing.count++;
    else mealCounts.set(e.mealId, { name: e.mealName, emoji: e.mealEmoji, count: 1 });
  });
  const topMeal = [...mealCounts.values()].sort((a, b) => b.count - a.count)[0];

  // Mood distribution
  const moodCounts = new Map<string, number>();
  entries.forEach((e) => {
    if (e.mealMood) {
      moodCounts.set(e.mealMood, (moodCounts.get(e.mealMood) || 0) + 1);
    }
  });
  const topMood = [...moodCounts.entries()].sort(([, a], [, b]) => b - a)[0];

  // Personality
  const personalities: Record<string, { label: string; emoji: string }> = {
    comfort: { label: "Comfort Creature", emoji: "🛋️" },
    quick: { label: "Speed Eater", emoji: "⚡" },
    healthy: { label: "Health Nut", emoji: "🥬" },
    "high-protein": { label: "Gym Bro", emoji: "💪" },
    any: { label: "Wildcard", emoji: "🎲" },
  };
  const personality = topMood ? personalities[topMood[0]] || { label: "Foodie", emoji: "🍽️" } : { label: "Explorer", emoji: "🧭" };

  // Percentage
  const topMoodPct = topMood ? Math.round((topMood[1] / entries.length) * 100) : 0;

  return { topMeal, personality, topMoodPct, totalMeals: entries.length };
}

export default function HistoryScreen({ entries, onClear, onRepick }: HistoryScreenProps) {
  const stats = computeStats(entries);

  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">History</h1>
          {entries.length > 0 && (
            <button
              onClick={() => { haptic("light"); onClear(); }}
              className="text-xs text-muted-foreground active:text-destructive transition-colors px-2 py-1 rounded-lg active:bg-destructive/10"
            >
              Clear all
            </button>
          )}
        </div>
        {entries.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {entries.length} meal{entries.length !== 1 ? "s" : ""} decided
          </p>
        )}
      </div>

      {/* Fun stats card */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-4 mb-5 overflow-hidden relative"
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

      {entries.length === 0 ? (
        <div className="text-center mt-16">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          </motion.div>
          <p className="text-foreground font-display font-semibold text-lg">No history yet</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto leading-relaxed">
            Tap "Let's eat!" on a meal and it'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
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
                  <p className="font-display font-semibold text-card-foreground truncate">
                    {entry.mealName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{entry.mealDescription}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {formatDate(entry.chosenAt)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
