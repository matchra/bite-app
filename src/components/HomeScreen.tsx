import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Budget, Mood, PrepTime, MealType } from "@/data/meals";
import { haptic } from "@/lib/haptics";

interface HomeScreenProps {
  onDecide: (prefs: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: MealType | "any" }) => void;
}

const subtitles = [
  "Stop thinking. Just eat.",
  "Your brain is tired. We got this.",
  "Decision fatigue? Not today.",
  "Less thinking, more eating.",
  "One tap away from food happiness.",
];

type ToggleValue = MealType | "any";

type Step = "mood" | "method" | "budget" | "time";

export default function HomeScreen({ onDecide }: HomeScreenProps) {
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState<Mood | null>(null);
  const [mealType, setMealType] = useState<ToggleValue | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [prepTime, setPrepTime] = useState<PrepTime | null>(null);
  const [subtitle] = useState(() => subtitles[Math.floor(Math.random() * subtitles.length)]);
  const [direction, setDirection] = useState(1);

  const selectMood = (v: Mood) => {
    haptic("light");
    setMood(v);
    setTimeout(() => { setDirection(1); setStep("method"); }, 200);
  };

  const selectMethod = (v: ToggleValue) => {
    haptic("light");
    setMealType(v);
    setTimeout(() => {
      setDirection(1);
      setStep("budget");
    }, 200);
  };

  const selectBudget = (v: Budget) => {
    haptic("light");
    setBudget(v);
    // If ordering, skip time and go straight to decide
    if (mealType === "order") {
      haptic("medium");
      const savedPrefs = {
        budget: v,
        mood: mood || "any",
        prepTime: "30+" as PrepTime,
        mealType: mealType as ToggleValue,
      };
      persist(savedPrefs);
      onDecide(savedPrefs);
    } else {
      setTimeout(() => { setDirection(1); setStep("time"); }, 200);
    }
  };

  const selectTime = (v: PrepTime) => {
    haptic("medium");
    setPrepTime(v);
    const savedPrefs = {
      budget: budget || "$$",
      mood: mood || "any",
      prepTime: v,
      mealType: (mealType || "any") as ToggleValue,
    };
    persist(savedPrefs);
    setTimeout(() => onDecide(savedPrefs), 200);
  };

  const persist = (p: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: ToggleValue }) => {
    localStorage.setItem("wsie-budget", p.budget);
    localStorage.setItem("wsie-mood", p.mood);
    localStorage.setItem("wsie-prepTime", p.prepTime);
    localStorage.setItem("wsie-mealType", p.mealType);
  };

  const goBack = () => {
    haptic("light");
    setDirection(-1);
    if (step === "method") setStep("mood");
    else if (step === "budget") setStep("method");
    else if (step === "time") setStep("budget");
  };

  const stepIndex = { mood: 0, method: 1, budget: 2, time: 3 };
  const totalSteps = mealType === "order" ? 3 : 4;
  const currentStep = stepIndex[step] + 1;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-5 pt-safe pb-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10"
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

      <div className="w-full max-w-sm">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-secondary">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: i < currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        {/* Back button */}
        <AnimatePresence>
          {step !== "mood" && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={goBack}
              className="text-sm text-muted-foreground mb-4 flex items-center gap-1 min-h-[44px] active:text-foreground transition-colors"
            >
              ← Back
            </motion.button>
          )}
        </AnimatePresence>

        {/* Steps */}
        <AnimatePresence mode="wait" custom={direction}>
          {step === "mood" && (
            <StepContainer key="mood" direction={direction} variants={variants}>
              <StepTitle>What's the vibe? ✨</StepTitle>
              <StepSubtitle>Pick what sounds right</StepSubtitle>
              <div className="flex flex-wrap gap-2.5 mt-6">
                {([
                  { value: "quick" as const, label: "Quick", emoji: "⚡" },
                  { value: "healthy" as const, label: "Healthy", emoji: "🥬" },
                  { value: "comfort" as const, label: "Comfort", emoji: "🛋️" },
                  { value: "high-protein" as const, label: "High Protein", emoji: "💪" },
                  { value: "any" as const, label: "Surprise me", emoji: "🎲" },
                ]).map((opt) => (
                  <Chip key={opt.value} selected={mood === opt.value} onClick={() => selectMood(opt.value)}>
                    {opt.emoji} {opt.label}
                  </Chip>
                ))}
              </div>
            </StepContainer>
          )}

          {step === "method" && (
            <StepContainer key="method" direction={direction} variants={variants}>
              <StepTitle>Cook or order? 🍳</StepTitle>
              <StepSubtitle>How much effort we talking?</StepSubtitle>
              <div className="flex flex-col gap-3 mt-6">
                {([
                  { value: "cook" as const, emoji: "🍳", label: "I'll cook", desc: "Time to channel your inner chef" },
                  { value: "order" as const, emoji: "📱", label: "Just order", desc: "Let someone else do the work" },
                  { value: "any" as const, emoji: "🤷", label: "Either works", desc: "I'm flexible" },
                ]).map((opt) => (
                  <BigOption
                    key={opt.value}
                    selected={mealType === opt.value}
                    onClick={() => selectMethod(opt.value)}
                    emoji={opt.emoji}
                    label={opt.label}
                    desc={opt.desc}
                  />
                ))}
              </div>
            </StepContainer>
          )}

          {step === "budget" && (
            <StepContainer key="budget" direction={direction} variants={variants}>
              <StepTitle>What's the budget? 💰</StepTitle>
              <StepSubtitle>No judgment either way</StepSubtitle>
              <div className="flex flex-col gap-3 mt-6">
                {([
                  { value: "$" as const, label: "Cheap", desc: "Under $5 · Keep it simple" },
                  { value: "$$" as const, label: "Moderate", desc: "$5–15 · The sweet spot" },
                  { value: "$$$" as const, label: "Treat yourself", desc: "$15+ · You deserve it" },
                ]).map((opt) => (
                  <BigOption
                    key={opt.value}
                    selected={budget === opt.value}
                    onClick={() => selectBudget(opt.value)}
                    emoji={opt.value}
                    label={opt.label}
                    desc={opt.desc}
                  />
                ))}
              </div>
            </StepContainer>
          )}

          {step === "time" && (
            <StepContainer key="time" direction={direction} variants={variants}>
              <StepTitle>How much time? ⏱️</StepTitle>
              <StepSubtitle>From zero effort to full send</StepSubtitle>
              <div className="flex flex-col gap-3 mt-6">
                {([
                  { value: "5" as const, label: "5 minutes", desc: "Basically instant" },
                  { value: "15" as const, label: "15 minutes", desc: "Quick and easy" },
                  { value: "30+" as const, label: "30+ minutes", desc: "Worth the wait" },
                ]).map((opt) => (
                  <BigOption
                    key={opt.value}
                    selected={prepTime === opt.value}
                    onClick={() => selectTime(opt.value)}
                    emoji="⏱️"
                    label={opt.label}
                    desc={opt.desc}
                  />
                ))}
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepContainer({ children, direction, variants }: { children: React.ReactNode; direction: number; variants: Record<string, (dir: number) => { opacity: number; x: number } | { opacity: number; x: number }> }) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-bold text-foreground">{children}</h2>;
}

function StepSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`px-5 py-3.5 min-h-[48px] rounded-2xl text-base font-medium transition-colors ${
        selected
          ? "bg-foreground text-background shadow-md"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {children}
    </motion.button>
  );
}

function BigOption({ selected, onClick, emoji, label, desc }: {
  selected: boolean; onClick: () => void; emoji: string; label: string; desc: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 min-h-[64px] rounded-2xl text-left transition-all border ${
        selected
          ? "bg-foreground text-background border-foreground shadow-md"
          : "bg-card text-card-foreground border-border"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className={`font-display font-semibold ${selected ? "text-background" : "text-card-foreground"}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${selected ? "text-background/70" : "text-muted-foreground"}`}>{desc}</p>
      </div>
    </motion.button>
  );
}
