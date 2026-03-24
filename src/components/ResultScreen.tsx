import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal, getCostLabel, getPrepLabel, getExplanation, Budget, Mood } from "@/data/meals";
import { Bookmark, RefreshCw, Check, Smartphone, Share2, MapPin } from "lucide-react";
import { haptic, hapticSuccess } from "@/lib/haptics";
import { fireConfetti } from "@/lib/confetti";

interface ResultScreenProps {
  meal: Meal;
  mood: Mood;
  budget: Budget;
  onShuffle?: () => void;
  onSave: (meal: Meal) => void;
  onDone: (meal: Meal) => void;
  isSaved: boolean;
  shuffleCount: number;
}

const shuffleMessages = [
  "Nah? Try this.",
  "Picky today 😏",
  "Coming up…",
  "Plot twist:",
  "How about…",
  "This one hits different.",
  "Alright, alright…",
  "Third time's a charm?",
  "You'll love this one.",
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
    onShuffle?.();
  };

  const handleDone = () => {
    haptic("heavy");
    fireConfetti();
    setTimeout(() => onDone(meal), 600);
  };

  const handleShare = async () => {
    haptic("light");
    const text = `${meal.emoji} I'm having ${meal.name}! ${meal.description}`;
    if (navigator.share) {
      try { await navigator.share({ title: `I'm eating ${meal.name}!`, text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  };

  const handleNearMe = () => {
    haptic("light");
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${meal.name} near me`)}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] px-6 pt-safe pb-8">
      {/* Shuffle message */}
      <div className="h-10 flex items-center justify-center pt-6">
        <AnimatePresence mode="wait">
          {shuffleCount > 0 && (
            <motion.p key={shuffleCount} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-muted-foreground font-medium">
              {shuffleMessages[shuffleCount % shuffleMessages.length]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            {/* Emoji */}
            <motion.div
              key={`emoji-${meal.id}`}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 14, delay: 0.05 }}
              className="text-6xl text-center mb-6"
            >
              {meal.emoji}
            </motion.div>

            {/* Name & description */}
            <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-[28px] font-bold text-center text-foreground leading-tight">
              {meal.name}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="text-muted-foreground text-center mt-2 text-sm">
              {meal.description}
            </motion.p>

            {/* Explanation */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }} className="text-xs text-center mt-2 text-muted-foreground/60 italic">
              "{explanation}"
            </motion.p>

            {/* Meta pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }} className="flex justify-center gap-2 mt-5 flex-wrap">
              <Pill>{getPrepLabel(meal.prepTime)}</Pill>
              <Pill>{getCostLabel(meal.budget)}</Pill>
              <Pill>{meal.type === "cook" ? "Cook" : "Order"}</Pill>
              {meal.diets.map((d) => (
                <Pill key={d} accent>{d}</Pill>
              ))}
            </motion.div>

            {/* Ingredients */}
            {meal.ingredients.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map((ing) => (
                    <span key={ing} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg capitalize">{ing}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            {meal.instructions && meal.instructions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">Steps</p>
                <ol className="space-y-2.5">
                  {meal.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-muted-foreground text-[11px] font-semibold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground/75 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            {/* Order CTA */}
            {meal.type === "order" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
                {meal.ingredients.length === 0 && (
                  <div className="text-center bg-secondary rounded-xl p-4 mb-3">
                    <Smartphone className="w-4 h-4 mx-auto text-muted-foreground mb-1.5" />
                    <p className="text-sm text-muted-foreground">Search <span className="font-semibold text-foreground">{meal.name}</span> on your delivery app</p>
                  </div>
                )}
                <button
                  onClick={handleNearMe}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium active:opacity-70 transition-opacity"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Find nearby
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-sm mx-auto space-y-3">
        <div className="flex gap-2">
          {onShuffle && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleShuffle} className="flex-1 flex items-center justify-center gap-2 py-3.5 min-h-[48px] rounded-xl bg-secondary text-secondary-foreground font-medium text-sm active:opacity-70 transition-opacity">
              <motion.div key={`spin-${shuffleCount}`} animate={{ rotate: shuffleCount > 0 ? 360 : 0 }} transition={{ duration: 0.3 }}>
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              Next
            </motion.button>
          )}
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleShare} className="flex items-center justify-center px-4 py-3.5 min-h-[48px] rounded-xl bg-secondary text-secondary-foreground active:opacity-70 transition-opacity">
            <Share2 className="w-4 h-4" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className={`flex items-center justify-center px-4 py-3.5 min-h-[48px] rounded-xl transition-all ${isSaved ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground active:opacity-70"}`}>
            <AnimatePresence mode="wait">
              {isSaved ? (
                <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="unsaved" exit={{ scale: 0 }}>
                  <Bookmark className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {justSaved && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-success text-center font-medium">
              Saved ✓
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDone}
          className="w-full py-4 min-h-[52px] rounded-xl bg-foreground text-background font-semibold text-sm active:opacity-90 transition-opacity"
        >
          Let's eat
        </motion.button>
      </motion.div>
    </div>
  );
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${
      accent ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"
    }`}>
      {children}
    </span>
  );
}
