import { useState } from "react";
import { motion } from "framer-motion";
import { Meal } from "@/data/meals";

interface MealImageProps {
  meal: Meal;
}

// Map meal IDs or names to Unsplash photo keywords for realistic food images
function getMealImageQuery(meal: Meal): string {
  const nameMap: Record<string, string> = {
    "Eggs & Toast": "fried eggs toast breakfast",
    "Instant Ramen Upgrade": "ramen noodles egg",
    "PB&J": "peanut butter jelly sandwich",
    "Banana Smoothie": "banana smoothie glass",
    "Greek Yogurt Bowl": "yogurt bowl berries granola",
    "Avocado Toast": "avocado toast",
    "Quesadilla": "cheese quesadilla",
    "Stir-Fried Rice": "fried rice wok",
    "Pasta with Butter & Parm": "butter parmesan pasta",
    "Chicken Wrap": "chicken wrap tortilla",
    "Grilled Cheese": "grilled cheese sandwich",
    "Veggie Stir Fry": "vegetable stir fry",
    "Omelette": "omelette breakfast",
    "Black Bean Tacos": "black bean tacos",
    "Salmon & Rice": "salmon rice plate",
    "Homemade Burger": "homemade burger",
    "Chicken Stir Fry": "chicken stir fry",
    "Spaghetti Bolognese": "spaghetti bolognese",
    "Curry & Rice": "curry rice bowl",
    "Pizza": "pizza slice",
    "Sushi": "sushi platter",
    "Burrito": "burrito",
    "Pho": "pho vietnamese soup",
    "Poke Bowl": "poke bowl",
    "Burger & Fries": "burger fries",
    "Pad Thai": "pad thai noodles",
    "Steak & Potatoes": "steak potatoes dinner",
    "Mac & Cheese": "mac and cheese",
    "Chicken Caesar Salad": "caesar salad chicken",
    "Pesto Pasta": "pesto pasta",
    "Shakshuka": "shakshuka eggs",
    "Teriyaki Chicken Bowl": "teriyaki chicken rice",
    "Mushroom Risotto": "mushroom risotto",
  };

  return nameMap[meal.name] || meal.name.toLowerCase().replace(/[^a-z ]/g, "");
}

export default function MealImage({ meal }: MealImageProps) {
  const [imgError, setImgError] = useState(false);
  const query = getMealImageQuery(meal);
  // Use Loremflickr for food images (Unsplash source is deprecated)
  const imgUrl = `https://loremflickr.com/400/240/${encodeURIComponent(query)},food`;

  // Fallback colors based on meal mood/type
  const fallbackColors: Record<string, string> = {
    quick: "from-amber-100 to-orange-200",
    healthy: "from-green-100 to-emerald-200",
    comfort: "from-orange-100 to-red-200",
    "high-protein": "from-red-100 to-rose-200",
    any: "from-muted to-secondary",
  };
  const moodColor = fallbackColors[meal.moods[0]] || fallbackColors.any;

  return (
    <div className="relative w-full aspect-[5/3] bg-muted overflow-hidden">
      {!imgError ? (
        <motion.img
          key={meal.id}
          src={imgUrl}
          alt={meal.name}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${moodColor}`}>
          <span className="text-5xl mb-2" role="img" aria-label={meal.name}>
            {meal.emoji}
          </span>
          <span className="text-sm font-medium text-foreground/60">{meal.name}</span>
        </div>
      )}
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
