import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import ResultScreen from "@/components/ResultScreen";
import MyEatsScreen from "@/components/MyEatsScreen";
import { HistoryEntry } from "@/components/HistoryScreen";
import SettingsScreen from "@/components/SettingsScreen";
import Onboarding from "@/components/Onboarding";
import BottomTabBar, { Tab } from "@/components/BottomTabBar";
import { PrivacyPolicy, TermsOfService, ContactSupport } from "@/components/LegalPage";
import { Meal, UserPreferences, recommendMeal, meals, Diet } from "@/data/meals";
import { haptic } from "@/lib/haptics";
import { updateStreak, shouldShowLunchReminder, dismissLunchReminder, sendNotification } from "@/lib/streak";

type View = "home" | "result" | "myeats" | "settings" | "privacy" | "terms" | "contact";

function loadSaved(): Meal[] {
  try { return JSON.parse(localStorage.getItem("wsie-saved") || "[]"); }
  catch { return []; }
}

function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem("wsie-history") || "[]"); }
  catch { return []; }
}

const slideVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

export default function Index() {
  const [view, setView] = useState<View>("home");
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saved, setSaved] = useState<Meal[]>(loadSaved);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("wsie-onboarded"));
  const [isRepick, setIsRepick] = useState(false);

  useEffect(() => {
    const s = updateStreak();
    setStreak(s.count);
  }, []);

  useEffect(() => {
    if (shouldShowLunchReminder()) {
      dismissLunchReminder();
      sendNotification("🍽️ Lunchtime!", "Need help deciding what to eat?");
    }
  }, []);

  const persistSaved = (m: Meal[]) => {
    setSaved(m);
    localStorage.setItem("wsie-saved", JSON.stringify(m));
  };

  const persistHistory = (entries: HistoryEntry[]) => {
    setHistory(entries);
    localStorage.setItem("wsie-history", JSON.stringify(entries));
  };

  const addToHistory = useCallback((meal: Meal) => {
    const entry: HistoryEntry = {
      id: `${meal.id}-${Date.now()}`,
      mealId: meal.id,
      mealName: meal.name,
      mealEmoji: meal.emoji,
      mealDescription: meal.description,
      mealMood: prefs?.mood,
      chosenAt: new Date().toISOString(),
    };
    const updated = [entry, ...history].slice(0, 50);
    persistHistory(updated);
  }, [history, prefs]);

  const clearHistory = useCallback(() => {
    persistHistory([]);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("wsie-onboarded", "1");
    setShowOnboarding(false);
  };

  const activeTab: Tab = (view === "home" || view === "result") ? "home" : (view === "myeats" ? "myeats" : "settings");

  const handleTabChange = (tab: Tab) => {
    haptic("light");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tab === "home") setView(view === "result" ? "result" : "home");
    else if (tab === "myeats") setView("myeats");
    else setView("settings");
  };

  const handleDecide = useCallback((p: UserPreferences) => {
    setPrefs(p);
    setExcluded([]);
    setShuffleCount(0);
    setIsRepick(false);
    const meal = recommendMeal(p, []);
    if (meal) { setCurrentMeal(meal); setView("result"); window.scrollTo({ top: 0 }); }
  }, []);

  // "Pick for me" — random meal with no filters
  const handlePickForMe = useCallback(() => {
    const randomPrefs: UserPreferences = {
      budget: (["$", "$$", "$$$"] as const)[Math.floor(Math.random() * 3)],
      mood: "any",
      prepTime: (["5", "15", "30+"] as const)[Math.floor(Math.random() * 3)],
      mealType: "any",
      diets: [],
    };
    setPrefs(randomPrefs);
    setExcluded([]);
    setShuffleCount(0);
    setIsRepick(false);
    const meal = recommendMeal(randomPrefs, []);
    if (meal) { setCurrentMeal(meal); setView("result"); window.scrollTo({ top: 0 }); }
  }, []);

  const handleShuffle = useCallback(() => {
    if (!prefs || !currentMeal) return;
    window.scrollTo({ top: 0 });
    const newExcluded = [...excluded, currentMeal.id];
    setExcluded(newExcluded);
    setShuffleCount((c) => c + 1);
    const meal = recommendMeal(prefs, newExcluded);
    if (meal) { setCurrentMeal(meal); }
    else {
      const fresh = recommendMeal(prefs, []);
      if (fresh) { setExcluded([]); setCurrentMeal(fresh); }
    }
  }, [prefs, currentMeal, excluded]);

  const handleRepick = useCallback((mealId: string) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;
    setCurrentMeal(meal);
    setIsRepick(true);
    setShuffleCount(0);
    setExcluded([]);
    setPrefs({ budget: meal.budget, mood: meal.moods[0] || "any", prepTime: meal.prepTime, mealType: meal.type, diets: meal.diets });
    setView("result");
    window.scrollTo({ top: 0 });
  }, []);

  const handleSave = useCallback((meal: Meal) => {
    if (saved.some((m) => m.id === meal.id)) return;
    persistSaved([meal, ...saved]);
  }, [saved]);

  const handleRemove = useCallback((id: string) => {
    persistSaved(saved.filter((m) => m.id !== id));
  }, [saved]);

  const showTabBar = view !== "result";

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative select-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          {view === "home" && (
            <HomeScreen
              onDecide={handleDecide}
              onPickForMe={handlePickForMe}
              onRepick={handleRepick}
              streak={streak}
            />
          )}
          {view === "result" && currentMeal && prefs && (
            <ResultScreen
              meal={currentMeal}
              mood={prefs.mood}
              budget={prefs.budget}
              onShuffle={isRepick ? undefined : handleShuffle}
              onSave={handleSave}
              onDone={(meal) => { addToHistory(meal); setView("home"); window.scrollTo({ top: 0 }); }}
              isSaved={saved.some((m) => m.id === currentMeal.id)}
              shuffleCount={shuffleCount}
            />
          )}
          {view === "myeats" && (
            <MyEatsScreen
              savedMeals={saved}
              historyEntries={history}
              onRemoveSaved={handleRemove}
              onClearHistory={clearHistory}
              onRepick={handleRepick}
            />
          )}
          {view === "settings" && <SettingsScreen onNavigate={(page) => setView(page)} streak={streak} totalDecided={history.length} />}
          {view === "privacy" && <PrivacyPolicy onBack={() => setView("settings")} />}
          {view === "terms" && <TermsOfService onBack={() => setView("settings")} />}
          {view === "contact" && <ContactSupport onBack={() => setView("settings")} />}
        </motion.div>
      </AnimatePresence>

      {showTabBar && <BottomTabBar active={activeTab} onChange={handleTabChange} savedCount={saved.length} />}
    </div>
  );
}
