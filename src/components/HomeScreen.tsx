import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Budget, Mood, PrepTime, MealType, Diet, getTimeGreeting, Meal } from "@/data/meals";
import { haptic } from "@/lib/haptics";
import { getMealOfTheDay } from "@/lib/mealOfTheDay";
import { Sparkles } from "lucide-react";

interface HomeScreenProps {
  onDecide: (prefs: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: MealType | "any"; diets: Diet[] }) => void;
  streak: number;
}

type ToggleValue = MealType | "any";
type Step = "mood" | "method" | "diet" | "budget" | "time";

export default function HomeScreen({ onDecide, streak }: HomeScreenProps) {
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState<Mood | null>(null);
  const [mealType, setMealType] = useState<ToggleValue | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [prepTime, setPrepTime] = useState<PrepTime | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [direction, setDirection] = useState(1);

  const { greeting, emoji } = getTimeGreeting();

  const selectMood = (v: Mood) => {
    haptic("light");
    setMood(v);
    setTimeout(() => { setDirection(1); setStep("method"); }, 200);
  };

  const selectMethod = (v: ToggleValue) => {
    haptic("light");
    setMealType(v);
    setTimeout(() => { setDirection(1); setStep("diet"); }, 200);
  };

  const handleDietNext = () => {
    haptic("light");
    setDirection(1);
    setStep("budget");
  };

  const toggleDiet = (d: Diet) => {
    haptic("light");
    setDiets((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const selectBudget = (v: Budget) => {
    haptic("light");
    setBudget(v);
    if (mealType === "order") {
      haptic("medium");
      const savedPrefs = { budget: v, mood: mood || "any" as Mood, prepTime: "30+" as PrepTime, mealType: mealType as ToggleValue, diets };
      persist(savedPrefs);
      onDecide(savedPrefs);
    } else {
      setTimeout(() => { setDirection(1); setStep("time"); }, 200);
    }
  };

  const selectTime = (v: PrepTime) => {
    haptic("medium");
    setPrepTime(v);
    const savedPrefs = { budget: budget || "$$" as Budget, mood: mood || "any" as Mood, prepTime: v, mealType: (mealType || "any") as ToggleValue, diets };
    persist(savedPrefs);
    setTimeout(() => onDecide(savedPrefs), 200);
  };

  const persist = (p: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: ToggleValue; diets: Diet[] }) => {
    localStorage.setItem("wsie-budget", p.budget);
    localStorage.setItem("wsie-mood", p.mood);
    localStorage.setItem("wsie-prepTime", p.prepTime);
    localStorage.setItem("wsie-mealType", p.mealType);
    localStorage.setItem("wsie-diets", JSON.stringify(p.diets));
  };

  const goBack = () => {
    haptic("light");
    setDirection(-1);
    if (step === "method") setStep("mood");
    else if (step === "diet") setStep("method");
    else if (step === "budget") setStep("diet");
    else if (step === "time") setStep("budget");
  };

  const stepOrder: Step[] = mealType === "order"
    ? ["mood", "method", "diet", "budget"]
    : ["mood", "method", "diet", "budget", "time"];
  const currentStep = stepOrder.indexOf(step) + 1;
  const totalSteps = stepOrder.length;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  const motd = getMealOfTheDay();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-5 pt-safe pb-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="text-4xl mb-2"
        >
          {emoji}
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          {greeting}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">What should you eat?</p>
        {streak > 1 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-primary font-semibold mt-2"
          >
            🔥 {streak}-day streak
          </motion.p>
        )}
      </motion.div>

      {/* Meal of the Day — only show on first step */}
      {step === "mood" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mb-6"
        >
          <div className="bg-card rounded-2xl border border-border p-3.5 flex items-center gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent pointer-events-none" />
            <span className="text-2xl relative z-10">{motd.emoji}</span>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Meal of the day</span>
              </div>
              <p className="font-display font-semibold text-sm text-card-foreground truncate">{motd.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{motd.description}</p>
            </div>
          </div>
        </motion.div>
      )}

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
                  <BigOption key={opt.value} selected={mealType === opt.value} onClick={() => selectMethod(opt.value)} emoji={opt.emoji} label={opt.label} desc={opt.desc} />
                ))}
              </div>
            </StepContainer>
          )}

          {step === "diet" && (
            <StepContainer key="diet" direction={direction} variants={variants}>
              <StepTitle>Any dietary needs? 🌱</StepTitle>
              <StepSubtitle>Select all that apply, or skip</StepSubtitle>
              <div className="flex flex-wrap gap-2.5 mt-6">
                {([
                  { value: "vegan" as Diet, label: "🌱 Vegan" },
                  { value: "vegetarian" as Diet, label: "🥚 Vegetarian" },
                  { value: "gluten-free" as Diet, label: "🌾 Gluten-free" },
                  { value: "dairy-free" as Diet, label: "🥛 Dairy-free" },
                  { value: "keto" as Diet, label: "🥑 Keto" },
                ]).map((opt) => (
                  <Chip key={opt.value} selected={diets.includes(opt.value)} onClick={() => toggleDiet(opt.value)}>
                    {opt.label}
                  </Chip>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleDietNext}
                className="w-full mt-6 py-4 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-colors"
              >
                {diets.length > 0 ? "Next →" : "Skip — I eat everything"}
              </motion.button>
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
                  <BigOption key={opt.value} selected={budget === opt.value} onClick={() => selectBudget(opt.value)} emoji={opt.value} label={opt.label} desc={opt.desc} />
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
                  <BigOption key={opt.value} selected={prepTime === opt.value} onClick={() => selectTime(opt.value)} emoji="⏱️" label={opt.label} desc={opt.desc} />
                ))}
              </div>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepContainer({ children, direction, variants }: { children: React.ReactNode; direction: number; variants: any }) {
  return (
    <motion.div custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
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
        selected ? "bg-foreground text-background shadow-md" : "bg-secondary text-secondary-foreground"
      }`}
    >
      {children}
    </motion.button>
  );
}

function BigOption({ selected, onClick, emoji, label, desc }: { selected: boolean; onClick: () => void; emoji: string; label: string; desc: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 min-h-[64px] rounded-2xl text-left transition-all border ${
        selected ? "bg-foreground text-background border-foreground shadow-md" : "bg-card text-card-foreground border-border"
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
