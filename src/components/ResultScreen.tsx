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
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="bg-card rounded-3xl p-6 shadow-xl border border-border">
            {/* Emoji */}
            <div className="text-6xl text-center mb-4">{meal.emoji}</div>

            {/* Name */}
            <h2 className="font-display text-2xl font-bold text-center text-card-foreground">{meal.name}</h2>

            {/* Description */}
            <p className="text-muted-foreground text-center mt-2">{meal.description}</p>

            {/* Explanation */}
            <p className="text-sm text-center mt-3 italic text-muted-foreground/80">"{explanation}"</p>

            {/* Meta */}
            <div className="flex justify-center gap-4 mt-5">
              <MetaBadge label={getPrepLabel(meal.prepTime)} />
              <MetaBadge label={getCostLabel(meal.budget)} />
              <MetaBadge label={meal.type === "cook" ? "🍳 Cook" : "📱 Order"} />
            </div>

            {/* Ingredients */}
            {meal.ingredients.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Ingredients</p>
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

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onShuffle}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Not this
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSave(meal)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-medium transition-colors ${
                isSaved ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="w-full mt-3 py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25"
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
