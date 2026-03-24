import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Budget, Mood, PrepTime, MealType, Diet, getTimeGreeting } from "@/data/meals";
import { haptic } from "@/lib/haptics";

interface HomeScreenProps {
  onDecide: (prefs: { budget: Budget; mood: Mood; prepTime: PrepTime; mealType: MealType | "any"; diets: Diet[]; availableIngredients?: string[] }) => void;
  streak: number;
}

type ToggleValue = MealType | "any";
type Step = "mood" | "method" | "ingredients" | "diet" | "budget" | "time";

const COMMON_INGREDIENTS = [
  { label: "Eggs", value: "eggs", emoji: "🥚" },
  { label: "Bread", value: "bread", emoji: "🍞" },
  { label: "Cheese", value: "cheese", emoji: "🧀" },
  { label: "Butter", value: "butter", emoji: "🧈" },
  { label: "Rice", value: "rice", emoji: "🍚" },
  { label: "Milk", value: "milk", emoji: "🥛" },
  { label: "Pasta", value: "pasta", emoji: "🍝" },
  { label: "Garlic", value: "garlic", emoji: "🧄" },
  { label: "Onion", value: "onion", emoji: "🧅" },
  { label: "Tomato", value: "tomato", emoji: "🍅" },
  { label: "Lettuce", value: "lettuce", emoji: "🥬" },
  { label: "Beans", value: "black beans", emoji: "🫘" },
  { label: "Tortillas", value: "tortillas", emoji: "🫓" },
  { label: "Chicken", value: "chicken", emoji: "🍗" },
  { label: "Beef", value: "ground beef", emoji: "🥩" },
  { label: "Banana", value: "banana", emoji: "🍌" },
  { label: "Avocado", value: "avocado", emoji: "🥑" },
  { label: "PB", value: "peanut butter", emoji: "🥜" },
  { label: "Honey", value: "honey", emoji: "🍯" },
  { label: "Olive oil", value: "olive oil", emoji: "🫒" },
];

export default function HomeScreen({ onDecide, streak }: HomeScreenProps) {
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState<Mood | null>(null);
  const [mealType, setMealType] = useState<ToggleValue | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [prepTime, setPrepTime] = useState<PrepTime | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);

  const { greeting, emoji } = getTimeGreeting();

  const selectMood = (v: Mood) => {
    haptic("light");
    setMood(v);
    setTimeout(() => { setDirection(1); setStep("method"); }, 150);
  };

  const selectMethod = (v: ToggleValue) => {
    haptic("light");
    setMealType(v);
    const nextStep: Step = (v === "order") ? "diet" : "ingredients";
    setTimeout(() => { setDirection(1); setStep(nextStep); }, 150);
  };

  const handleIngredientsNext = () => {
    haptic("light");
    setDirection(1);
    setStep("diet");
  };

  const toggleIngredient = (ing: string) => {
    haptic("light");
    setAvailableIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
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
      setTimeout(() => { setDirection(1); setStep("time"); }, 150);
    }
  };

  const selectTime = (v: PrepTime) => {
    haptic("medium");
    setPrepTime(v);
    const savedPrefs = {
      budget: budget || "$$" as Budget,
      mood: mood || "any" as Mood,
      prepTime: v,
      mealType: (mealType || "any") as ToggleValue,
      diets,
      availableIngredients: availableIngredients.length > 0 ? availableIngredients : undefined,
    };
    persist(savedPrefs);
    setTimeout(() => onDecide(savedPrefs), 150);
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
    else if (step === "ingredients") setStep("method");
    else if (step === "diet") setStep(mealType !== "order" ? "ingredients" : "method");
    else if (step === "budget") setStep("diet");
    else if (step === "time") setStep("budget");
  };

  const getStepOrder = (): Step[] => {
    if (mealType === "order") return ["mood", "method", "diet", "budget"];
    return ["mood", "method", "ingredients", "diet", "budget", "time"];
  };

  const stepOrder = getStepOrder();
  const currentStep = stepOrder.indexOf(step) + 1;
  const totalSteps = stepOrder.length;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-80px)] px-6 pt-safe">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-8 pb-2"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-muted-foreground text-sm">{emoji} {greeting}</p>
          {streak > 1 && (
            <span className="text-xs text-muted-foreground">🔥 {streak} days</span>
          )}
        </div>
        <h1 className="font-display text-[28px] font-bold text-foreground">
          What should you eat?
        </h1>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-1 my-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-border">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: i < currentStep ? "100%" : "0%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>

      {/* Back */}
      <AnimatePresence>
        {step !== "mood" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={goBack}
            className="text-sm text-muted-foreground mb-5 flex items-center gap-1.5 min-h-[44px] active:text-foreground transition-colors self-start"
          >
            ← Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Steps */}
      <div className="flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "mood" && (
            <StepContainer key="mood" direction={direction} variants={variants}>
              <StepLabel>Vibe</StepLabel>
              <StepTitle>What are you feeling?</StepTitle>
              <div className="grid grid-cols-2 gap-2.5 mt-8">
                {([
                  { value: "quick" as const, label: "Quick", emoji: "⚡" },
                  { value: "healthy" as const, label: "Healthy", emoji: "🥬" },
                  { value: "comfort" as const, label: "Comfort", emoji: "🛋️" },
                  { value: "high-protein" as const, label: "Protein", emoji: "💪" },
                ]).map((opt) => (
                  <SelectCard key={opt.value} selected={mood === opt.value} onClick={() => selectMood(opt.value)} emoji={opt.emoji} label={opt.label} />
                ))}
                <div className="col-span-2">
                  <SelectCard selected={mood === "any"} onClick={() => selectMood("any")} emoji="🎲" label="Surprise me" />
                </div>
              </div>
            </StepContainer>
          )}

          {step === "method" && (
            <StepContainer key="method" direction={direction} variants={variants}>
              <StepLabel>Method</StepLabel>
              <StepTitle>Cook or order?</StepTitle>
              <div className="flex flex-col gap-2.5 mt-8">
                {([
                  { value: "cook" as const, emoji: "🍳", label: "I'll cook" },
                  { value: "order" as const, emoji: "📱", label: "Just order" },
                  { value: "any" as const, emoji: "🤷", label: "Either works" },
                ]).map((opt) => (
                  <SelectCard key={opt.value} selected={mealType === opt.value} onClick={() => selectMethod(opt.value)} emoji={opt.emoji} label={opt.label} />
                ))}
              </div>
            </StepContainer>
          )}

          {step === "ingredients" && (
            <StepContainer key="ingredients" direction={direction} variants={variants}>
              <StepLabel>Pantry</StepLabel>
              <StepTitle>What do you have?</StepTitle>
              <div className="flex flex-wrap gap-2 mt-8">
                {COMMON_INGREDIENTS.map((ing) => (
                  <Chip key={ing.value} selected={availableIngredients.includes(ing.value)} onClick={() => toggleIngredient(ing.value)}>
                    {ing.emoji} {ing.label}
                  </Chip>
                ))}
              </div>
              <CTAButton onClick={handleIngredientsNext}>
                {availableIngredients.length > 0 ? `Continue with ${availableIngredients.length} items` : "Skip"}
              </CTAButton>
            </StepContainer>
          )}

          {step === "diet" && (
            <StepContainer key="diet" direction={direction} variants={variants}>
              <StepLabel>Diet</StepLabel>
              <StepTitle>Any restrictions?</StepTitle>
              <div className="flex flex-wrap gap-2 mt-8">
                {([
                  { value: "vegan" as Diet, label: "Vegan", emoji: "🌱" },
                  { value: "vegetarian" as Diet, label: "Vegetarian", emoji: "🥚" },
                  { value: "gluten-free" as Diet, label: "GF", emoji: "🌾" },
                  { value: "dairy-free" as Diet, label: "DF", emoji: "🥛" },
                  { value: "keto" as Diet, label: "Keto", emoji: "🥑" },
                ]).map((opt) => (
                  <Chip key={opt.value} selected={diets.includes(opt.value)} onClick={() => toggleDiet(opt.value)}>
                    {opt.emoji} {opt.label}
                  </Chip>
                ))}
              </div>
              <CTAButton onClick={handleDietNext}>
                {diets.length > 0 ? "Continue" : "No restrictions"}
              </CTAButton>
            </StepContainer>
          )}

          {step === "budget" && (
            <StepContainer key="budget" direction={direction} variants={variants}>
              <StepLabel>Budget</StepLabel>
              <StepTitle>How much?</StepTitle>
              <div className="flex flex-col gap-2.5 mt-8">
                {([
                  { value: "$" as const, label: "Under $5", sub: "Keep it simple" },
                  { value: "$$" as const, label: "$5–15", sub: "The sweet spot" },
                  { value: "$$$" as const, label: "$15+", sub: "Treat yourself" },
                ]).map((opt) => (
                  <SelectCard key={opt.value} selected={budget === opt.value} onClick={() => selectBudget(opt.value)} emoji={opt.value} label={opt.label} sub={opt.sub} />
                ))}
              </div>
            </StepContainer>
          )}

          {step === "time" && (
            <StepContainer key="time" direction={direction} variants={variants}>
              <StepLabel>Time</StepLabel>
              <StepTitle>How long?</StepTitle>
              <div className="flex flex-col gap-2.5 mt-8">
                {([
                  { value: "5" as const, label: "5 min", sub: "Basically instant" },
                  { value: "15" as const, label: "15 min", sub: "Quick and easy" },
                  { value: "30+" as const, label: "30+ min", sub: "Worth the wait" },
                ]).map((opt) => (
                  <SelectCard key={opt.value} selected={prepTime === opt.value} onClick={() => selectTime(opt.value)} emoji="⏱️" label={opt.label} sub={opt.sub} />
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
    <motion.div custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function StepLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{children}</p>;
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-bold text-foreground">{children}</h2>;
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-all ${
        selected
          ? "bg-foreground text-background"
          : "bg-card text-secondary-foreground border border-border"
      }`}
    >
      {children}
    </motion.button>
  );
}

function SelectCard({ selected, onClick, emoji, label, sub }: { selected: boolean; onClick: () => void; emoji: string; label: string; sub?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-4 min-h-[56px] rounded-xl text-left transition-all border ${
        selected
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-card-foreground border-border"
      }`}
    >
      <span className="text-xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${selected ? "text-background" : "text-card-foreground"}`}>{label}</p>
        {sub && <p className={`text-xs mt-0.5 ${selected ? "text-background/60" : "text-muted-foreground"}`}>{sub}</p>}
      </div>
    </motion.button>
  );
}

function CTAButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full mt-8 py-4 min-h-[56px] rounded-xl bg-foreground text-background font-semibold text-sm active:opacity-90 transition-opacity"
    >
      {children}
    </motion.button>
  );
}
