import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import ResultScreen from "@/components/ResultScreen";
import SavedMeals from "@/components/SavedMeals";
import SettingsScreen from "@/components/SettingsScreen";
import BottomTabBar, { Tab } from "@/components/BottomTabBar";
import { PrivacyPolicy, TermsOfService, ContactSupport } from "@/components/LegalPage";
import { Meal, UserPreferences, recommendMeal } from "@/data/meals";
import { haptic } from "@/lib/haptics";

type View = "home" | "result" | "saved" | "settings" | "privacy" | "terms" | "contact";

function loadSaved(): Meal[] {
  try { return JSON.parse(localStorage.getItem("wsie-saved") || "[]"); }
  catch { return []; }
}

const slideVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function Index() {
  const [view, setView] = useState<View>("home");
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saved, setSaved] = useState<Meal[]>(loadSaved);
  const [shuffleCount, setShuffleCount] = useState(0);

  const persistSaved = (meals: Meal[]) => {
    setSaved(meals);
    localStorage.setItem("wsie-saved", JSON.stringify(meals));
  };

  const activeTab: Tab = (view === "home" || view === "result") ? "home" : (view === "saved" ? "saved" : "settings");

  const handleTabChange = (tab: Tab) => {
    haptic("light");
    if (tab === "home") setView(view === "result" ? "result" : "home");
    else setView(tab);
  };

  const handleDecide = useCallback((p: UserPreferences) => {
    setPrefs(p);
    setExcluded([]);
    setShuffleCount(0);
    const meal = recommendMeal(p, []);
    if (meal) { setCurrentMeal(meal); setView("result"); }
  }, []);

  const handleShuffle = useCallback(() => {
    if (!prefs || !currentMeal) return;
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

  const handleSave = useCallback((meal: Meal) => {
    if (saved.some((m) => m.id === meal.id)) return;
    persistSaved([meal, ...saved]);
  }, [saved]);

  const handleRemove = useCallback((id: string) => {
    persistSaved(saved.filter((m) => m.id !== id));
  }, [saved]);

  const showTabBar = view !== "result";

  return (
    <div className="relative select-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {view === "home" && <HomeScreen onDecide={handleDecide} />}
          {view === "result" && currentMeal && prefs && (
            <ResultScreen
              meal={currentMeal}
              mood={prefs.mood}
              budget={prefs.budget}
              onShuffle={handleShuffle}
              onSave={handleSave}
              onDone={() => setView("home")}
              isSaved={saved.some((m) => m.id === currentMeal.id)}
              shuffleCount={shuffleCount}
            />
          )}
          {view === "saved" && <SavedMeals meals={saved} onRemove={handleRemove} />}
          {view === "settings" && <SettingsScreen onNavigate={(page) => setView(page)} />}
          {view === "privacy" && <PrivacyPolicy onBack={() => setView("settings")} />}
          {view === "terms" && <TermsOfService onBack={() => setView("settings")} />}
          {view === "contact" && <ContactSupport onBack={() => setView("settings")} />}
        </motion.div>
      </AnimatePresence>

      {showTabBar && <BottomTabBar active={activeTab} onChange={handleTabChange} savedCount={saved.length} />}
    </div>
  );
}
