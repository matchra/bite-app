import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/data/meals";
import { Trash2, UtensilsCrossed, ShoppingCart, ChevronDown, ChevronUp, Check } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface SavedMealsProps {
  meals: Meal[];
  onRemove: (id: string) => void;
}

type TabView = "meals" | "grocery";

export default function SavedMeals({ meals, onRemove }: SavedMealsProps) {
  const [tab, setTab] = useState<TabView>("meals");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleRemove = (id: string) => {
    haptic("light");
    onRemove(id);
  };

  const cookMeals = meals.filter((m) => m.type === "cook" && m.ingredients.length > 0);

  const groceryList = useMemo(() => {
    const map = new Map<string, string[]>();
    cookMeals.forEach((meal) => {
      meal.ingredients.forEach((ing) => {
        const key = ing.toLowerCase();
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key)!.includes(meal.name)) map.get(key)!.push(meal.name);
      });
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ingredient, fromMeals]) => ({ ingredient, fromMeals }));
  }, [cookMeals]);

  const toggleCheck = (item: string) => {
    haptic("light");
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="pt-6 mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Your Picks</h1>
        {meals.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} you're into
          </p>
        )}
      </div>

      {/* Tab switcher */}
      {meals.length > 0 && (
        <div className="flex gap-2 mb-5 bg-secondary rounded-xl p-1">
          <TabButton active={tab === "meals"} onClick={() => { haptic("light"); setTab("meals"); }}>
            🍽️ Meals
          </TabButton>
          <TabButton active={tab === "grocery"} onClick={() => { haptic("light"); setTab("grocery"); }}>
            🛒 Grocery List
          </TabButton>
        </div>
      )}

      <AnimatePresence mode="wait">
        {tab === "meals" && (
          <motion.div key="meals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {meals.length === 0 ? (
              <div className="text-center mt-16">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
                  <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                </motion.div>
                <p className="text-foreground font-display font-semibold text-lg">No saves yet</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto leading-relaxed">
                  Bookmark meals you love and they'll show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {meals.map((meal, i) => (
                    <motion.div
                      key={meal.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -80, scale: 0.9 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border"
                    >
                      <motion.span className="text-2xl" whileTap={{ scale: 1.3, rotate: 10 }}>
                        {meal.emoji}
                      </motion.span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-card-foreground truncate">{meal.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
                      </div>
                      <button onClick={() => handleRemove(meal.id)} className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground active:text-destructive transition-colors rounded-xl active:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {tab === "grocery" && (
          <motion.div key="grocery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {cookMeals.length === 0 ? (
              <div className="text-center mt-16">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-foreground font-display font-semibold text-lg">No cook meals saved</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-[240px] mx-auto">
                  Save some cook meals to auto-generate a grocery list!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {checkedItems.size} of {groceryList.length} items checked
                </p>
                <div className="space-y-1.5">
                  {groceryList.map(({ ingredient, fromMeals }, i) => {
                    const isChecked = checkedItems.has(ingredient);
                    return (
                      <motion.button
                        key={ingredient}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => toggleCheck(ingredient)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isChecked ? "bg-muted/50" : "bg-card border border-border"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked ? "bg-success text-success-foreground" : "border-2 border-border"
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium capitalize transition-all ${isChecked ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                            {ingredient}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            for {fromMeals.join(", ")}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
