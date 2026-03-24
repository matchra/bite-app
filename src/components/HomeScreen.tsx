import { useState } from "react";
import { motion } from "framer-motion";
import { Budget, Mood, PrepTime, MealType } from "@/data/meals";
import { haptic } from "@/lib/haptics";

interface HomeScreenProps {
  onDecide: (prefs: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: MealType | "any" }) => void;
}

const budgetOptions: { value: Budget; label: string }[] = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
];

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: "quick", label: "Quick", emoji: "⚡" },
  { value: "healthy", label: "Healthy", emoji: "🥬" },
  { value: "comfort", label: "Comfort", emoji: "🛋️" },
  { value: "high-protein", label: "High Protein", emoji: "💪" },
  { value: "any", label: "Surprise me", emoji: "🎲" },
];

const timeOptions: { value: PrepTime; label: string }[] = [
  { value: "5", label: "5 min" },
  { value: "15", label: "15 min" },
  { value: "30+", label: "30+ min" },
];

const subtitles = [
  "Stop thinking. Just eat.",
  "Your brain is tired. We got this.",
  "Decision fatigue? Not today.",
  "Less thinking, more eating.",
  "One tap away from food happiness.",
];

type ToggleValue = MealType | "any";

export default function HomeScreen({ onDecide }: HomeScreenProps) {
  const [budget, setBudget] = useState<Budget>(() => {
    return (localStorage.getItem("wsie-budget") as Budget) || "$$";
  });
  const [mood, setMood] = useState<Mood>(() => {
    return (localStorage.getItem("wsie-mood") as Mood) || "any";
  });
  const [prepTime, setPrepTime] = useState<PrepTime>(() => {
    return (localStorage.getItem("wsie-prepTime") as PrepTime) || "15";
  });
  const [mealType, setMealType] = useState<ToggleValue>(() => {
    return (localStorage.getItem("wsie-mealType") as ToggleValue) || "any";
  });

  const [subtitle] = useState(() => subtitles[Math.floor(Math.random() * subtitles.length)]);

  const handleDecide = () => {
    haptic("medium");
    localStorage.setItem("wsie-budget", budget);
    localStorage.setItem("wsie-mood", mood);
    localStorage.setItem("wsie-prepTime", prepTime);
    localStorage.setItem("wsie-mealType", mealType);
    onDecide({ budget, mood, prepTime, mealType });
  };

  const handleChipSelect = <T,>(setter: (v: T) => void, value: T) => {
    haptic("light");
    setter(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-5 pt-safe pb-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="text-4xl mb-3"
        >
          🍽️
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
          What Should I Eat?
        </h1>
        <p className="text-muted-foreground mt-1.5 text-base">{subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm space-y-5"
      >
        <Section label="💰 Budget">
          <div className="flex gap-2">
            {budgetOptions.map((opt) => (
              <Chip key={opt.value} selected={budget === opt.value} onClick={() => handleChipSelect(setBudget, opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section label="✨ Vibe">
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((opt) => (
              <Chip key={opt.value} selected={mood === opt.value} onClick={() => handleChipSelect(setMood, opt.value)}>
                {opt.emoji} {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section label="⏱️ Time">
          <div className="flex gap-2">
            {timeOptions.map((opt) => (
              <Chip key={opt.value} selected={prepTime === opt.value} onClick={() => handleChipSelect(setPrepTime, opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section label="🍳 Method">
          <div className="flex gap-2">
            {([
              { value: "cook" as const, label: "🍳 Cook" },
              { value: "order" as const, label: "📱 Order" },
              { value: "any" as const, label: "🤷 Either" },
            ]).map((opt) => (
              <Chip key={opt.value} selected={mealType === opt.value} onClick={() => handleChipSelect(setMealType, opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDecide}
          className="w-full py-4 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg shadow-lg shadow-primary/25 active:bg-primary/90 transition-colors"
        >
          Decide for me 🍽️
        </motion.button>
      </motion.div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
        selected
          ? "bg-foreground text-background shadow-md"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {children}
    </motion.button>
  );
}
