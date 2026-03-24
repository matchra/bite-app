import { useState } from "react";
import { motion } from "framer-motion";
import { Budget, Mood, PrepTime, MealType } from "@/data/meals";

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
  { value: "any", label: "I don't care", emoji: "🤷" },
];

const timeOptions: { value: PrepTime; label: string }[] = [
  { value: "5", label: "5 min" },
  { value: "15", label: "15 min" },
  { value: "30+", label: "30+ min" },
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

  const handleDecide = () => {
    localStorage.setItem("wsie-budget", budget);
    localStorage.setItem("wsie-mood", mood);
    localStorage.setItem("wsie-prepTime", prepTime);
    localStorage.setItem("wsie-mealType", mealType);
    onDecide({ budget, mood, prepTime, mealType });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
          What Should I Eat?
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Stop thinking. Just eat.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-sm space-y-6"
      >
        {/* Budget */}
        <Section label="Budget">
          <div className="flex gap-2">
            {budgetOptions.map((opt) => (
              <Chip key={opt.value} selected={budget === opt.value} onClick={() => setBudget(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Mood */}
        <Section label="Mood">
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((opt) => (
              <Chip key={opt.value} selected={mood === opt.value} onClick={() => setMood(opt.value)}>
                {opt.emoji} {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Time */}
        <Section label="Time">
          <div className="flex gap-2">
            {timeOptions.map((opt) => (
              <Chip key={opt.value} selected={prepTime === opt.value} onClick={() => setPrepTime(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Cook or Order */}
        <Section label="Cook or Order?">
          <div className="flex gap-2">
            {([
              { value: "cook" as const, label: "🍳 Cook" },
              { value: "order" as const, label: "📱 Order" },
              { value: "any" as const, label: "Either" },
            ]).map((opt) => (
              <Chip key={opt.value} selected={mealType === opt.value} onClick={() => setMealType(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleDecide}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-lg shadow-lg shadow-primary/25 transition-colors active:bg-primary/90"
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
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        selected
          ? "bg-foreground text-background shadow-md"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {children}
    </button>
  );
}
