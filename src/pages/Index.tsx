import { useState, useCallback } from "react";
import HomeScreen from "@/components/HomeScreen";
import ResultScreen from "@/components/ResultScreen";
import SavedMeals from "@/components/SavedMeals";
import { Meal, UserPreferences, recommendMeal } from "@/data/meals";
import { Bookmark } from "lucide-react";

type Screen = "home" | "result" | "saved";

function loadSaved(): Meal[] {
  try {
    return JSON.parse(localStorage.getItem("wsie-saved") || "[]");
  } catch { return []; }
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saved, setSaved] = useState<Meal[]>(loadSaved);

  const persistSaved = (meals: Meal[]) => {
    setSaved(meals);
    localStorage.setItem("wsie-saved", JSON.stringify(meals));
  };

  const handleDecide = useCallback((p: UserPreferences) => {
    setPrefs(p);
    setExcluded([]);
    const meal = recommendMeal(p, []);
    if (meal) {
      setCurrentMeal(meal);
      setScreen("result");
    }
  }, []);

  const handleShuffle = useCallback(() => {
    if (!prefs || !currentMeal) return;
    const newExcluded = [...excluded, currentMeal.id];
    setExcluded(newExcluded);
    const meal = recommendMeal(prefs, newExcluded);
    if (meal) {
      setCurrentMeal(meal);
    } else {
      // Reset exclusions and try again
      const fresh = recommendMeal(prefs, []);
      if (fresh) {
        setExcluded([]);
        setCurrentMeal(fresh);
      }
    }
  }, [prefs, currentMeal, excluded]);

  const handleSave = useCallback((meal: Meal) => {
    if (saved.some((m) => m.id === meal.id)) return;
    persistSaved([meal, ...saved]);
  }, [saved]);

  const handleRemove = useCallback((id: string) => {
    persistSaved(saved.filter((m) => m.id !== id));
  }, [saved]);

  return (
    <div className="relative">
      {/* Saved button - visible on home */}
      {screen === "home" && saved.length > 0 && (
        <button
          onClick={() => setScreen("saved")}
          className="fixed top-5 right-5 z-10 p-3 rounded-2xl bg-card border border-border shadow-sm text-foreground"
        >
          <Bookmark className="w-5 h-5" />
          {saved.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {saved.length}
            </span>
          )}
        </button>
      )}

      {screen === "home" && <HomeScreen onDecide={handleDecide} />}
      {screen === "result" && currentMeal && prefs && (
        <ResultScreen
          meal={currentMeal}
          mood={prefs.mood}
          budget={prefs.budget}
          onShuffle={handleShuffle}
          onSave={handleSave}
          onDone={() => setScreen("home")}
          isSaved={saved.some((m) => m.id === currentMeal.id)}
        />
      )}
      {screen === "saved" && <SavedMeals meals={saved} onBack={() => setScreen("home")} onRemove={handleRemove} />}
    </div>
  );
}
