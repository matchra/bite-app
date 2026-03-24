import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal, getCostLabel, getPrepLabel, getExplanation, Budget, Mood } from "@/data/meals";
import { Bookmark, RefreshCw, Check, ChefHat, Smartphone } from "lucide-react";
import { haptic, hapticSuccess } from "@/lib/haptics";

interface ResultScreenProps {
  meal: Meal;
  mood: Mood;
  budget: Budget;
  onShuffle: () => void;
  onSave: (meal: Meal) => void;
  onDone: () => void;
  isSaved: boolean;
  shuffleCount: number;
}

const shuffleMessages = [
  "Nah? Okay, try this one.",
  "Picky today, huh? 😏",
  "Coming right up…",
  "Plot twist:",
  "How about…",
  "This one hits different.",
  "Alright alright alright…",
  "Third time's the charm?",
  "You're gonna love this one.",
  "Trust the process.",
];

export default function ResultScreen({ meal, mood, budget, onShuffle, onSave, onDone, isSaved, shuffleCount }: ResultScreenProps) {
  const explanation = getExplanation(mood, budget);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    if (isSaved) return;
    hapticSuccess();
    setJustSaved(true);
    onSave(meal);
    setTimeout(() => setJustSaved(false), 1200);
  };

  const handleShuffle = () => {
    haptic("medium");
    onShuffle();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-5 pt-safe pb-6">
      {/* Shuffle message */}
      <AnimatePresence mode="wait">
        {shuffleCount > 0 && (
          <motion.p
            key={shuffleCount}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground mb-3 font-medium"
          >
            {shuffleMessages[shuffleCount % shuffleMessages.length]}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -60 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-3xl p-6 shadow-xl border border-border overflow-hidden relative">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

            {/* Emoji with bounce */}
            <motion.div
              key={`emoji-${meal.id}`}
              initial={{ scale: 0, rotate: -20, y: 20 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.08 }}
              className="text-7xl text-center mb-4 relative z-10"
            >
              {meal.emoji}
            </motion.div>

            {/* Name with stagger */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="font-display text-2xl font-bold text-center text-card-foreground relative z-10"
            >
              {meal.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className="text-muted-foreground text-center mt-2 text-sm relative z-10"
            >
              {meal.description}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.3 }}
              className="text-xs text-center mt-3 italic text-muted-foreground/70 relative z-10"
            >
              "{explanation}"
            </motion.p>

            {/* Meta badges with stagger */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex justify-center gap-3 mt-5 relative z-10"
            >
              <MetaBadge label={getPrepLabel(meal.prepTime)} />
              <MetaBadge label={getCostLabel(meal.budget)} />
              <MetaBadge label={meal.type === "cook" ? "🍳 Cook" : "📱 Order"} />
            </motion.div>

            {/* Ingredients */}
            {meal.ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="mt-5 relative z-10"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What you'll need</p>
                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map((ing, i) => (
                    <motion.span
                      key={ing}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.38 + i * 0.03 }}
                      className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1.5 rounded-lg"
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {meal.type === "order" && meal.ingredients.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-5 text-center bg-muted/50 rounded-2xl p-4 relative z-10"
              >
                <Smartphone className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Open your delivery app and search for <span className="font-semibold text-foreground">{meal.name}</span>
                </p>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex gap-3 mt-5"
          >
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleShuffle}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[48px] rounded-2xl bg-secondary text-secondary-foreground font-medium active:bg-secondary/70 transition-colors"
            >
              <motion.div
                key={`spin-${shuffleCount}`}
                animate={{ rotate: shuffleCount > 0 ? 360 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              Nah, next
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-2xl font-medium transition-all ${
                isSaved
                  ? "bg-success/10 text-success"
                  : "bg-secondary text-secondary-foreground active:bg-secondary/70"
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div key="saved" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="unsaved" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Bookmark className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Saved toast */}
          <AnimatePresence>
            {justSaved && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-success text-center mt-2 font-medium"
              >
                Saved! 🎉
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            whileTap={{ scale: 0.96 }}
            onClick={onDone}
            className="w-full mt-3 py-3.5 min-h-[48px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-colors"
          >
            Let's eat! 🍴
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
