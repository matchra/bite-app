import { motion } from "framer-motion";
import { Meal } from "@/data/meals";
import { ArrowLeft, Trash2 } from "lucide-react";

interface SavedMealsProps {
  meals: Meal[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

export default function SavedMeals({ meals, onBack, onRemove }: SavedMealsProps) {
  return (
    <div className="min-h-screen px-5 py-8 max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl bg-secondary text-secondary-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display text-xl font-bold text-foreground">Saved Meals</h2>
      </div>

      {meals.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-muted-foreground">No saved meals yet.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Hit the bookmark when you find something good!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
            >
              <span className="text-2xl">{meal.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
              </div>
              <button onClick={() => onRemove(meal.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
