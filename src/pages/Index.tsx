import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeScreen from "@/components/HomeScreen";
import ResultScreen from "@/components/ResultScreen";
import SavedMeals from "@/components/SavedMeals";
import SettingsScreen from "@/components/SettingsScreen";
import BottomTabBar, { Tab } from "@/components/BottomTabBar";
import { PrivacyPolicy, TermsOfService, ContactSupport } from "@/components/LegalPage";
import { Meal, UserPreferences, recommendMeal } from "@/data/meals";

type View = "home" | "result" | "saved" | "settings" | "privacy" | "terms" | "contact";

function loadSaved(): Meal[] {
  try { return JSON.parse(localStorage.getItem("wsie-saved") || "[]"); }
  catch { return []; }
}

export default function Index() {
  const [view, setView] = useState<View>("home");
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saved, setSaved] = useState<Meal[]>(loadSaved);

  const persistSaved = (meals: Meal[]) => {
    setSaved(meals);
    localStorage.setItem("wsie-saved", JSON.stringify(meals));
  };

  const activeTab: Tab = (view === "home" || view === "result") ? "home" : (view === "saved" ? "saved" : "settings");

  const handleTabChange = (tab: Tab) => {
    if (tab === "home") setView(view === "result" ? "result" : "home");
    else setView(tab);
  };

  const handleDecide = useCallback((p: UserPreferences) => {
    setPrefs(p);
    setExcluded([]);
    const meal = recommendMeal(p, []);
    if (meal) { setCurrentMeal(meal); setView("result"); }
  }, []);

  const handleShuffle = useCallback(() => {
    if (!prefs || !currentMeal) return;
    const newExcluded = [...excluded, currentMeal.id];
    setExcluded(newExcluded);
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
    <div className="relative select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
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
