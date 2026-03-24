import { motion } from "framer-motion";
import { Meal } from "@/data/meals";
import { Trash2 } from "lucide-react";

interface SavedMealsProps {
  meals: Meal[];
  onRemove: (id: string) => void;
}

export default function SavedMeals({ meals, onRemove }: SavedMealsProps) {
  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Saved Meals</h1>
        <p className="text-sm text-muted-foreground mt-1">{meals.length} meal{meals.length !== 1 ? "s" : ""} saved</p>
      </div>

      {meals.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-foreground font-display font-semibold">No saved meals yet</p>
          <p className="text-sm text-muted-foreground mt-1.5">Tap the bookmark icon when you find something good!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {meals.map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
            >
              <span className="text-2xl">{meal.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
              </div>
              <button
                onClick={() => onRemove(meal.id)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
