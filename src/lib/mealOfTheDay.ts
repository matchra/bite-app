import { meals, Meal } from "@/data/meals";

/**
 * Returns a deterministic "meal of the day" that changes daily.
 * Uses the date as a seed to pick from all meals.
 */
export function getMealOfTheDay(): Meal {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % meals.length;
  return meals[index];
}
