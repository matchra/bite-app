import { motion, AnimatePresence } from "framer-motion";
import { Meal, getCostLabel, getPrepLabel, getExplanation, Budget, Mood } from "@/data/meals";
import { Bookmark, RefreshCw, Check } from "lucide-react";

interface ResultScreenProps {
  meal: Meal;
  mood: Mood;
  budget: Budget;
  onShuffle: () => void;
  onSave: (meal: Meal) => void;
  onDone: () => void;
  isSaved: boolean;
}

export default function ResultScreen({ meal, mood, budget, onShuffle, onSave, onDone, isSaved }: ResultScreenProps) {
  const explanation = getExplanation(mood, budget);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-5 pt-safe pb-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-3xl p-6 shadow-xl border border-border">
            <motion.div
              key={`emoji-${meal.id}`}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="text-6xl text-center mb-4"
            >
              {meal.emoji}
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-center text-card-foreground">{meal.name}</h2>
            <p className="text-muted-foreground text-center mt-2 text-sm">{meal.description}</p>
            <p className="text-xs text-center mt-3 italic text-muted-foreground/70">"{explanation}"</p>

            <div className="flex justify-center gap-3 mt-5">
              <MetaBadge label={getPrepLabel(meal.prepTime)} />
              <MetaBadge label={getCostLabel(meal.budget)} />
              <MetaBadge label={meal.type === "cook" ? "🍳 Cook" : "📱 Order"} />
            </div>

            {meal.ingredients.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map((ing) => (
                    <span key={ing} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {meal.type === "order" && meal.ingredients.length === 0 && (
              <div className="mt-5 text-center">
                <p className="text-sm text-muted-foreground">Open your favorite delivery app and search for <span className="font-medium text-foreground">{meal.name}</span></p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onShuffle}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[48px] rounded-2xl bg-secondary text-secondary-foreground font-medium active:bg-secondary/70 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Not this
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => onSave(meal)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-2xl font-medium transition-colors ${
                isSaved ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground active:bg-secondary/70"
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onDone}
            className="w-full mt-3 py-3.5 min-h-[48px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-colors"
          >
            Done ✓
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MetaBadge({ label }: { label: string }) {
  return (
    <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium">
      {label}
    </span>
  );
}
