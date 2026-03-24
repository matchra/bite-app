import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/data/meals";
import { Trash2, UtensilsCrossed } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface SavedMealsProps {
  meals: Meal[];
  onRemove: (id: string) => void;
}

const emptyMessages = [
  "Nothing here yet. Go discover something delicious!",
  "Your collection is empty. Time to explore!",
  "Bookmark meals you love and they'll show up here.",
];

export default function SavedMeals({ meals, onRemove }: SavedMealsProps) {
  const handleRemove = (id: string) => {
    haptic("light");
    onRemove(id);
  };

  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Your Picks</h1>
        {meals.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} you're into
          </p>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {meals.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            </motion.div>
            <p className="text-foreground font-display font-semibold text-lg">No saves yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto leading-relaxed">
              {emptyMessages[Math.floor(Math.random() * emptyMessages.length)]}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {meals.map((meal, i) => (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -80, scale: 0.9 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
              >
                <motion.span
                  className="text-2xl"
                  whileTap={{ scale: 1.3, rotate: 10 }}
                >
                  {meal.emoji}
                </motion.span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
                </div>
                <button
                  onClick={() => handleRemove(meal.id)}
                  className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors rounded-xl active:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
