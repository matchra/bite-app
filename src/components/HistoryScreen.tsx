import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { haptic } from "@/lib/haptics";

export interface HistoryEntry {
  id: string;
  mealId: string;
  mealName: string;
  mealEmoji: string;
  mealDescription: string;
  chosenAt: string; // ISO date string
}

interface HistoryScreenProps {
  entries: HistoryEntry[];
  onClear: () => void;
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

export default function HistoryScreen({ entries, onClear }: HistoryScreenProps) {
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
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -80, scale: 0.9 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
