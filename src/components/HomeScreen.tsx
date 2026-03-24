import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Budget, Mood, PrepTime, MealType, Diet, getTimeGreeting, Meal } from "@/data/meals";
import { getMealOfTheDay } from "@/lib/mealOfTheDay";
import { haptic } from "@/lib/haptics";
import { Sparkles, Zap, Check } from "lucide-react";

interface HomeScreenProps {
  onDecide: (prefs: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: MealType | "any"; diets: Diet[]; availableIngredients?: string[] }) => void;
  onPickForMe: () => void;
  onRepick: (mealId: string) => void;
  streak: number;
}

type Step = "vibe" | "constraints" | "preferences";

const COMMON_INGREDIENTS = [
  { label: "🥚 Eggs", value: "eggs" },
  { label: "🍞 Bread", value: "bread" },
  { label: "🧀 Cheese", value: "cheese" },
  { label: "🧈 Butter", value: "butter" },
  { label: "🍚 Rice", value: "rice" },
  { label: "🥛 Milk", value: "milk" },
  { label: "🍝 Pasta", value: "pasta" },
  { label: "🧄 Garlic", value: "garlic" },
  { label: "🧅 Onion", value: "onion" },
  { label: "🍅 Tomato", value: "tomato" },
  { label: "🥬 Lettuce", value: "lettuce" },
  { label: "🫘 Beans", value: "black beans" },
  { label: "🫓 Tortillas", value: "tortillas" },
  { label: "🍗 Chicken", value: "chicken" },
  { label: "🥩 Ground beef", value: "ground beef" },
  { label: "🍌 Banana", value: "banana" },
  { label: "🥑 Avocado", value: "avocado" },
  { label: "🥜 PB", value: "peanut butter" },
  { label: "🍯 Honey", value: "honey" },
  { label: "🫒 Olive oil", value: "olive oil" },
];

const STEP_LABELS = ["Vibe", "Constraints", "Preferences"];

export default function HomeScreen({ onDecide, onPickForMe, onRepick, streak }: HomeScreenProps) {
  const [step, setStep] = useState<Step>("vibe");
  const [mood, setMood] = useState<Mood | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [prepTime, setPrepTime] = useState<PrepTime | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);

  const { greeting, emoji } = getTimeGreeting();
  const dailyMeal = getMealOfTheDay();

  const stepIndex = step === "vibe" ? 0 : step === "constraints" ? 1 : 2;

  const selectMood = (v: Mood) => {
    haptic("light");
    setMood(v);
    setTimeout(() => { setDirection(1); setStep("constraints"); }, 200);
  };

  const handleConstraintsNext = () => {
    if (!budget || !prepTime) return;
    haptic("light");
    setDirection(1);
    setStep("preferences");
  };

  const toggleDiet = (d: Diet) => {
    haptic("light");
    setDiets((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const toggleIngredient = (ing: string) => {
    haptic("light");
    setAvailableIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
  };

  const handleFinish = () => {
    haptic("medium");
    const prefs = {
      budget: budget || "$$" as Budget,
      mood: mood || "any" as Mood,
      prepTime: prepTime || "15" as PrepTime,
      mealType: "any" as MealType | "any",
      diets,
      availableIngredients: availableIngredients.length > 0 ? availableIngredients : undefined,
    };
    localStorage.setItem("wsie-budget", prefs.budget);
    localStorage.setItem("wsie-mood", prefs.mood);
    localStorage.setItem("wsie-prepTime", prefs.prepTime);
    localStorage.setItem("wsie-diets", JSON.stringify(prefs.diets));
    onDecide(prefs);
  };

  const handleSkipPreferences = () => {
    haptic("light");
    handleFinish();
  };

  const goBack = () => {
    haptic("light");
    setDirection(-1);
    if (step === "constraints") setStep("vibe");
    else if (step === "preferences") setStep("constraints");
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100dvh-80px)] px-5 pt-safe pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mt-6 mb-4"
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

      {/* Daily suggestion card */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onRepick(dailyMeal.id)}
        className="w-full max-w-sm mb-4 bg-card rounded-2xl border border-border p-3.5 text-left active:bg-muted/50 transition-all duration-200 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 mb-1.5 relative z-10">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Today's pick</span>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-3xl">{dailyMeal.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-card-foreground truncate">{dailyMeal.name}</p>
            <p className="text-xs text-muted-foreground truncate">{dailyMeal.description}</p>
          </div>
        </div>
      </motion.button>

      {/* Pick for me button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { haptic("medium"); onPickForMe(); }}
        className="w-full max-w-sm mb-5 py-3.5 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-all duration-200 ease-out flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5" />
        Pick for me 🎲
      </motion.button>

      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 flex-1 ${i <= stepIndex ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all duration-300 ${
                  i < stepIndex ? "bg-primary text-primary-foreground" :
                  i === stepIndex ? "bg-foreground text-background" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground hidden min-[360px]:inline">{label}</span>
              </div>
              {i < 2 && <div className={`h-px flex-1 transition-colors duration-300 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Back button */}
        <AnimatePresence>
          {step !== "vibe" && (
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
          {/* STEP 1: Vibe */}
          {step === "vibe" && (
            <StepContainer key="vibe" direction={direction} variants={variants}>
              <StepTitle>What's the vibe? ✨</StepTitle>
              <StepSubtitle>Pick what sounds right</StepSubtitle>
              <div className="flex flex-wrap gap-2.5 mt-5">
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

          {/* STEP 2: Constraints (time + budget combined) */}
          {step === "constraints" && (
            <StepContainer key="constraints" direction={direction} variants={variants}>
              <StepTitle>Time & budget ⏱️💰</StepTitle>
              <StepSubtitle>How much time and money?</StepSubtitle>

              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Time</p>
                <div className="flex gap-2">
                  {([
                    { value: "5" as const, label: "5 min", emoji: "⚡" },
                    { value: "15" as const, label: "15 min", emoji: "⏱️" },
                    { value: "30+" as const, label: "30+ min", emoji: "🕐" },
                  ]).map((opt) => (
                    <Chip key={opt.value} selected={prepTime === opt.value} onClick={() => { haptic("light"); setPrepTime(opt.value); }} flex>
                      {opt.emoji} {opt.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Budget</p>
                <div className="flex gap-2">
                  {([
                    { value: "$" as const, label: "Cheap", emoji: "💵" },
                    { value: "$$" as const, label: "Moderate", emoji: "💰" },
                    { value: "$$$" as const, label: "Treat", emoji: "💎" },
                  ]).map((opt) => (
                    <Chip key={opt.value} selected={budget === opt.value} onClick={() => { haptic("light"); setBudget(opt.value); }} flex>
                      {opt.emoji} {opt.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConstraintsNext}
                disabled={!budget || !prepTime}
                className={`w-full mt-6 py-4 min-h-[52px] rounded-2xl font-display font-bold text-base shadow-lg transition-all duration-200 ease-out ${
                  budget && prepTime
                    ? "bg-primary text-primary-foreground shadow-primary/25 active:bg-primary/90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed shadow-none"
                }`}
              >
                Next →
              </motion.button>
            </StepContainer>
          )}

          {/* STEP 3: Preferences (diet + ingredients, skippable) */}
          {step === "preferences" && (
            <StepContainer key="preferences" direction={direction} variants={variants}>
              <StepTitle>Any preferences? 🌱</StepTitle>
              <StepSubtitle>Optional — skip to get surprised</StepSubtitle>

              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Dietary</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: "vegan" as Diet, label: "🌱 Vegan" },
                    { value: "vegetarian" as Diet, label: "🥚 Vegetarian" },
                    { value: "gluten-free" as Diet, label: "🌾 GF" },
                    { value: "dairy-free" as Diet, label: "🥛 DF" },
                    { value: "keto" as Diet, label: "🥑 Keto" },
                  ]).map((opt) => (
                    <Chip key={opt.value} selected={diets.includes(opt.value)} onClick={() => toggleDiet(opt.value)}>
                      {opt.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">What's in your kitchen?</p>
                <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                  {COMMON_INGREDIENTS.map((ing) => (
                    <Chip key={ing.value} selected={availableIngredients.includes(ing.value)} onClick={() => toggleIngredient(ing.value)} small>
                      {ing.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 mt-6">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSkipPreferences}
                  className="flex-1 py-4 min-h-[52px] rounded-2xl bg-secondary text-secondary-foreground font-display font-bold text-sm active:bg-secondary/70 transition-all duration-200 ease-out"
                >
                  Skip — surprise me
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFinish}
                  className="flex-1 py-4 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm shadow-lg shadow-primary/25 active:bg-primary/90 transition-all duration-200 ease-out"
                >
                  Find my meal →
                </motion.button>
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

function Chip({ selected, onClick, children, flex, small }: { selected: boolean; onClick: () => void; children: React.ReactNode; flex?: boolean; small?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      animate={{ scale: selected ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`${small ? "px-3 py-2 text-sm" : "px-5 py-3.5 text-base"} min-h-[44px] rounded-2xl font-medium transition-all duration-200 ease-out ${flex ? "flex-1" : ""} ${
        selected
          ? "bg-foreground text-background shadow-md ring-2 ring-foreground/20"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {selected && !small && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mr-1">✓</motion.span>}
      {children}
    </motion.button>
  );
}
