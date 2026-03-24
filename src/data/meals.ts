export type Budget = "$" | "$$" | "$$$";
export type Mood = "quick" | "healthy" | "comfort" | "high-protein" | "any";
export type PrepTime = "5" | "15" | "30+";
export type MealType = "cook" | "order";
export type Diet = "vegan" | "vegetarian" | "gluten-free" | "dairy-free" | "keto";
export type MealTime = "breakfast" | "lunch" | "dinner" | "snack" | "anytime";

export interface Meal {
  id: string;
  name: string;
  emoji: string;
  description: string;
  moods: Mood[];
  prepTime: PrepTime;
  budget: Budget;
  type: MealType;
  ingredients: string[];
  tags: string[];
  diets: Diet[];
  mealTimes: MealTime[];
}

export const meals: Meal[] = [
  // Quick + Cheap + Cook
  { id: "1", name: "Eggs & Toast", emoji: "🍳", description: "Classic, fast, never disappoints.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["eggs", "bread", "butter"], tags: ["high-protein", "low-effort"], diets: ["vegetarian"], mealTimes: ["breakfast", "anytime"] },
  { id: "2", name: "Instant Ramen Upgrade", emoji: "🍜", description: "Add an egg and some green onion. Chef mode.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["instant ramen", "egg", "green onion", "soy sauce"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },
  { id: "3", name: "PB&J", emoji: "🥜", description: "You're never too old for this.", moods: ["quick", "any"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "peanut butter", "jelly"], tags: ["low-effort"], diets: ["vegan"], mealTimes: ["breakfast", "snack", "anytime"] },
  { id: "4", name: "Banana Smoothie", emoji: "🍌", description: "Blend and go. Liquid energy.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["banana", "milk", "honey", "ice"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast", "snack"] },
  { id: "5", name: "Greek Yogurt Bowl", emoji: "🫐", description: "Top it with whatever's in the fridge.", moods: ["quick", "healthy", "high-protein"], prepTime: "5", budget: "$", type: "cook", ingredients: ["greek yogurt", "granola", "berries", "honey"], tags: ["high-protein", "low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast", "snack"] },
  { id: "6", name: "Avocado Toast", emoji: "🥑", description: "Yes, that avocado toast. It's good.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "avocado", "salt", "lemon"], tags: ["low-effort"], diets: ["vegan"], mealTimes: ["breakfast", "lunch"] },
  { id: "7", name: "Cereal", emoji: "🥣", description: "No judgment. Just vibes.", moods: ["quick", "any"], prepTime: "5", budget: "$", type: "cook", ingredients: ["cereal", "milk"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast", "snack"] },
  { id: "8", name: "Quesadilla", emoji: "🧀", description: "Cheese + tortilla = happiness.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["tortilla", "cheese", "butter"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["lunch", "dinner", "snack"] },

  { id: "9", name: "Stir-Fried Rice", emoji: "🍚", description: "Use yesterday's rice. Game changer.", moods: ["quick", "comfort"], prepTime: "15", budget: "$", type: "cook", ingredients: ["rice", "egg", "soy sauce", "veggies", "oil"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "10", name: "Pasta with Butter & Parm", emoji: "🍝", description: "Italian grandma approved (probably).", moods: ["comfort", "any"], prepTime: "15", budget: "$", type: "cook", ingredients: ["pasta", "butter", "parmesan", "salt"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },
  { id: "11", name: "Chicken Wrap", emoji: "🌯", description: "Protein-packed and portable.", moods: ["healthy", "high-protein"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["tortilla", "chicken breast", "lettuce", "tomato", "sauce"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "12", name: "Tuna Salad", emoji: "🥗", description: "Mix, scoop, done. Protein city.", moods: ["healthy", "high-protein", "quick"], prepTime: "5", budget: "$", type: "cook", ingredients: ["canned tuna", "mayo", "celery", "bread"], tags: ["high-protein", "low-effort"], diets: ["dairy-free"], mealTimes: ["lunch"] },
  { id: "13", name: "Grilled Cheese", emoji: "🧈", description: "Crispy outside, melty inside. Perfect.", moods: ["comfort", "quick"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "cheese", "butter"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["lunch", "snack"] },
  { id: "14", name: "Veggie Stir Fry", emoji: "🥦", description: "Colorful, crunchy, and actually good.", moods: ["healthy", "any"], prepTime: "15", budget: "$", type: "cook", ingredients: ["mixed veggies", "soy sauce", "garlic", "oil", "rice"], tags: [], diets: ["vegan", "dairy-free", "gluten-free"], mealTimes: ["lunch", "dinner"] },
  { id: "15", name: "Omelette", emoji: "🥚", description: "Throw in whatever you've got.", moods: ["quick", "high-protein", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["eggs", "cheese", "veggies", "salt"], tags: ["high-protein", "low-effort"], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["breakfast", "lunch", "anytime"] },
  { id: "16", name: "Black Bean Tacos", emoji: "🌮", description: "Cheap, filling, endlessly customizable.", moods: ["comfort", "healthy"], prepTime: "15", budget: "$", type: "cook", ingredients: ["tortillas", "black beans", "salsa", "cheese", "lettuce"], tags: [], diets: ["vegetarian", "gluten-free"], mealTimes: ["lunch", "dinner"] },
  { id: "17", name: "Caprese Sandwich", emoji: "🥪", description: "Fresh mozzarella hits different.", moods: ["healthy", "quick"], prepTime: "5", budget: "$$", type: "cook", ingredients: ["bread", "mozzarella", "tomato", "basil", "olive oil"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["lunch"] },
  { id: "18", name: "Protein Shake", emoji: "🥤", description: "Gym bro fuel. Gets the job done.", moods: ["quick", "high-protein"], prepTime: "5", budget: "$", type: "cook", ingredients: ["protein powder", "milk", "banana"], tags: ["high-protein", "low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast", "snack", "anytime"] },

  { id: "19", name: "Salmon & Rice", emoji: "🍣", description: "Fancy but actually easy.", moods: ["healthy", "high-protein"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["salmon fillet", "rice", "soy sauce", "lemon"], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "20", name: "Turkey Burger", emoji: "🍔", description: "Lighter than beef, still satisfying.", moods: ["high-protein", "comfort"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["ground turkey", "bun", "lettuce", "tomato", "onion"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "21", name: "Shrimp Tacos", emoji: "🦐", description: "Squeeze some lime. Taste the coast.", moods: ["healthy", "comfort"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["shrimp", "tortillas", "cabbage", "lime", "sauce"], tags: [], diets: ["dairy-free", "gluten-free"], mealTimes: ["lunch", "dinner"] },
  { id: "22", name: "Chicken Caesar Salad", emoji: "🥗", description: "The salad that doesn't feel like a salad.", moods: ["healthy", "high-protein"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["chicken", "romaine", "parmesan", "croutons", "caesar dressing"], tags: ["high-protein"], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "23", name: "Pesto Pasta", emoji: "🌿", description: "Green, garlicky, gorgeous.", moods: ["comfort", "any"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["pasta", "pesto", "parmesan", "cherry tomatoes"], tags: [], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },

  { id: "24", name: "Homemade Burger", emoji: "🍔", description: "Worth the effort. Every. Single. Time.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["ground beef", "bun", "cheese", "lettuce", "tomato", "onion"], tags: ["high-protein"], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "25", name: "Chicken Stir Fry", emoji: "🍗", description: "Sizzling, saucy, satisfying.", moods: ["healthy", "high-protein", "comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["chicken", "bell peppers", "broccoli", "soy sauce", "rice"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["dinner"] },
  { id: "26", name: "Baked Chicken Thighs", emoji: "🍗", description: "Set it, forget it, eat it.", moods: ["high-protein", "comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["chicken thighs", "garlic", "herbs", "olive oil", "potatoes"], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "27", name: "Spaghetti Bolognese", emoji: "🍝", description: "Sunday vibes any day of the week.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["spaghetti", "ground beef", "tomato sauce", "onion", "garlic"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["dinner"] },
  { id: "28", name: "Curry & Rice", emoji: "🍛", description: "Warm, spicy, soul-hugging.", moods: ["comfort", "healthy"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["curry paste", "coconut milk", "chicken or tofu", "rice", "veggies"], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "29", name: "Sheet Pan Veggies & Sausage", emoji: "🥕", description: "One pan. Zero stress.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["sausage", "bell peppers", "potatoes", "onion", "olive oil"], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "30", name: "Beef Tacos", emoji: "🌮", description: "Taco Tuesday doesn't need a day.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["ground beef", "taco shells", "cheese", "lettuce", "salsa", "sour cream"], tags: [], diets: ["gluten-free"], mealTimes: ["dinner"] },
  { id: "31", name: "Lemon Herb Salmon", emoji: "🐟", description: "Looks fancy. Tastes fancier.", moods: ["healthy", "high-protein"], prepTime: "30+", budget: "$$$", type: "cook", ingredients: ["salmon", "lemon", "herbs", "asparagus", "olive oil"], tags: ["high-protein"], diets: ["gluten-free", "dairy-free", "keto"], mealTimes: ["dinner"] },
  { id: "32", name: "Stuffed Bell Peppers", emoji: "🫑", description: "Colorful vessels of deliciousness.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["bell peppers", "ground meat", "rice", "tomato sauce", "cheese"], tags: ["high-protein"], diets: ["gluten-free"], mealTimes: ["dinner"] },
  { id: "33", name: "Chicken Parmesan", emoji: "🍗", description: "Crispy, cheesy, absolute banger.", moods: ["comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["chicken breast", "breadcrumbs", "marinara", "mozzarella", "pasta"], tags: ["high-protein"], diets: [], mealTimes: ["dinner"] },
  { id: "34", name: "Shakshuka", emoji: "🍅", description: "Eggs poached in spicy tomato. Chef's kiss.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$", type: "cook", ingredients: ["eggs", "canned tomatoes", "onion", "spices", "bread"], tags: ["high-protein"], diets: ["vegetarian"], mealTimes: ["breakfast", "lunch", "dinner"] },

  // Order options
  { id: "35", name: "Pizza", emoji: "🍕", description: "You know you want to.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },
  { id: "36", name: "Sushi", emoji: "🍱", description: "Treat yourself. You deserve raw fish.", moods: ["healthy", "any"], prepTime: "30+", budget: "$$$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "37", name: "Burrito", emoji: "🌯", description: "A foil-wrapped hug.", moods: ["comfort", "high-protein", "any"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "38", name: "Pho", emoji: "🍜", description: "Warm broth heals everything.", moods: ["comfort", "healthy"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "39", name: "Thai Curry", emoji: "🍛", description: "Spicy, creamy, transportive.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "40", name: "Chinese Takeout", emoji: "🥡", description: "Lo mein, fried rice, the works.", moods: ["comfort", "any"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "41", name: "Sub Sandwich", emoji: "🥖", description: "Footlong energy.", moods: ["quick", "comfort", "any"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: [], mealTimes: ["lunch"] },
  { id: "42", name: "Chicken Wings", emoji: "🍗", description: "Saucy, crispy, finger-licking.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free", "dairy-free", "keto"], mealTimes: ["dinner", "snack"] },
  { id: "43", name: "Poke Bowl", emoji: "🐟", description: "Fresh, colorful, Instagram-worthy.", moods: ["healthy", "high-protein"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "44", name: "Falafel Wrap", emoji: "🧆", description: "Crispy chickpea perfection.", moods: ["healthy", "any"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["vegan", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "45", name: "Pad Thai", emoji: "🍜", description: "Sweet, tangy, noodly bliss.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "46", name: "Açaí Bowl", emoji: "🫐", description: "Purple superfood goodness.", moods: ["healthy", "quick"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["breakfast", "snack"] },
  { id: "47", name: "Kebab Plate", emoji: "🥙", description: "Grilled meat, rice, all the sauces.", moods: ["high-protein", "comfort"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "48", name: "Burger & Fries", emoji: "🍟", description: "The classic combo. No regrets.", moods: ["comfort", "any"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "49", name: "Salad Bowl", emoji: "🥗", description: "Healthy and you'll feel smug about it.", moods: ["healthy"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegan", "vegetarian", "gluten-free", "dairy-free"], mealTimes: ["lunch"] },
  { id: "50", name: "Ramen (Restaurant)", emoji: "🍜", description: "Rich broth, chewy noodles, soft egg.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },

  { id: "51", name: "Rice Bowl with Veggies", emoji: "🍚", description: "Simple, wholesome, customizable.", moods: ["healthy", "any"], prepTime: "15", budget: "$", type: "cook", ingredients: ["rice", "mixed veggies", "soy sauce", "sesame oil"], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "52", name: "Overnight Oats", emoji: "🥣", description: "Prep tonight, eat tomorrow. Future you says thanks.", moods: ["healthy", "quick"], prepTime: "5", budget: "$", type: "cook", ingredients: ["oats", "milk", "chia seeds", "berries", "honey"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast"] },
  { id: "53", name: "BLT Sandwich", emoji: "🥓", description: "Bacon makes everything better.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bacon", "lettuce", "tomato", "bread", "mayo"], tags: [], diets: ["dairy-free"], mealTimes: ["lunch"] },
  { id: "54", name: "Cottage Cheese & Fruit", emoji: "🍑", description: "The TikTok girlies were right.", moods: ["healthy", "high-protein", "quick"], prepTime: "5", budget: "$", type: "cook", ingredients: ["cottage cheese", "fruit", "honey"], tags: ["high-protein", "low-effort"], diets: ["vegetarian", "gluten-free"], mealTimes: ["breakfast", "snack"] },
  { id: "55", name: "Chicken Fried Rice", emoji: "🍳", description: "Leftover rice's glow-up moment.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$", type: "cook", ingredients: ["rice", "chicken", "egg", "soy sauce", "veggies"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "56", name: "Garlic Butter Shrimp", emoji: "🦐", description: "5 ingredients, 10 minutes, infinite flavor.", moods: ["high-protein", "healthy"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["shrimp", "garlic", "butter", "lemon", "parsley"], tags: ["high-protein"], diets: ["gluten-free", "keto"], mealTimes: ["dinner"] },
  { id: "57", name: "Mac & Cheese", emoji: "🧀", description: "The ultimate comfort. No debate.", moods: ["comfort"], prepTime: "15", budget: "$", type: "cook", ingredients: ["macaroni", "cheese", "milk", "butter"], tags: [], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },
  { id: "58", name: "Hummus & Pita Plate", emoji: "🫓", description: "Mediterranean snack plate energy.", moods: ["healthy", "quick"], prepTime: "5", budget: "$", type: "cook", ingredients: ["hummus", "pita", "cucumber", "tomato", "olives"], tags: ["low-effort"], diets: ["vegan", "dairy-free"], mealTimes: ["lunch", "snack"] },
  { id: "59", name: "Steak & Potatoes", emoji: "🥩", description: "Go big or go home.", moods: ["high-protein", "comfort"], prepTime: "30+", budget: "$$$", type: "cook", ingredients: ["steak", "potatoes", "butter", "garlic", "herbs"], tags: ["high-protein"], diets: ["gluten-free", "keto"], mealTimes: ["dinner"] },
  { id: "60", name: "Fish Tacos", emoji: "🐟", description: "Light, zesty, beach-day vibes.", moods: ["healthy", "comfort"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["white fish", "tortillas", "cabbage", "lime", "crema"], tags: [], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },

  // --- 50 NEW MEALS ---

  // Quick Cook - Cheap
  { id: "61", name: "Cinnamon Toast", emoji: "🍞", description: "Butter, sugar, cinnamon. Childhood unlocked.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "butter", "cinnamon", "sugar"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["breakfast", "snack"] },
  { id: "62", name: "Microwave Mug Cake", emoji: "🧁", description: "Dessert in 90 seconds. Science is beautiful.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["flour", "cocoa", "sugar", "egg", "milk"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["snack"] },
  { id: "63", name: "Cucumber & Cream Cheese Bites", emoji: "🥒", description: "Light, crunchy, oddly addictive.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["cucumber", "cream cheese", "everything seasoning"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["snack"] },
  { id: "64", name: "Fried Egg Sandwich", emoji: "🥚", description: "Runny yolk on toast. Peak simplicity.", moods: ["quick", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "egg", "cheese", "hot sauce"], tags: ["high-protein", "low-effort"], diets: ["vegetarian"], mealTimes: ["breakfast", "lunch"] },
  { id: "65", name: "Apple & Peanut Butter", emoji: "🍎", description: "Nature's candy with a protein boost.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["apple", "peanut butter"], tags: ["low-effort"], diets: ["vegan", "gluten-free"], mealTimes: ["snack"] },
  { id: "66", name: "Toast with Honey & Banana", emoji: "🍯", description: "Sweet, filling, zero brain cells required.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["bread", "honey", "banana"], tags: ["low-effort"], diets: ["vegan"], mealTimes: ["breakfast", "snack"] },
  { id: "67", name: "Miso Soup", emoji: "🥣", description: "Warm, salty, instant comfort.", moods: ["quick", "healthy"], prepTime: "5", budget: "$", type: "cook", ingredients: ["miso paste", "tofu", "green onion", "water"], tags: ["low-effort"], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner", "snack"] },
  { id: "68", name: "Cheese & Crackers", emoji: "🧀", description: "Fancy-ish snack. Zero effort.", moods: ["quick", "any"], prepTime: "5", budget: "$", type: "cook", ingredients: ["cheese", "crackers"], tags: ["low-effort"], diets: ["vegetarian"], mealTimes: ["snack"] },

  // 15 min Cook - Cheap/Moderate
  { id: "69", name: "Egg Fried Noodles", emoji: "🍜", description: "Slurp-worthy in under 15 minutes.", moods: ["quick", "comfort"], prepTime: "15", budget: "$", type: "cook", ingredients: ["noodles", "egg", "soy sauce", "sesame oil", "veggies"], tags: [], diets: ["vegetarian", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "70", name: "Tomato Soup", emoji: "🍅", description: "Cozy in a bowl. Pair with grilled cheese.", moods: ["comfort", "healthy"], prepTime: "15", budget: "$", type: "cook", ingredients: ["canned tomatoes", "garlic", "onion", "cream", "basil"], tags: [], diets: ["vegetarian", "gluten-free"], mealTimes: ["lunch", "dinner"] },
  { id: "71", name: "Tuna Melt", emoji: "🐟", description: "Crispy, melty, high-protein goodness.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$", type: "cook", ingredients: ["bread", "canned tuna", "cheese", "mayo"], tags: ["high-protein"], diets: [], mealTimes: ["lunch"] },
  { id: "72", name: "Sweet Potato Toast", emoji: "🍠", description: "Slice it thin, toast it up. Gluten-free hack.", moods: ["healthy", "quick"], prepTime: "15", budget: "$", type: "cook", ingredients: ["sweet potato", "avocado", "salt"], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["breakfast", "snack"] },
  { id: "73", name: "Chickpea Salad", emoji: "🫘", description: "Canned chickpeas do the heavy lifting.", moods: ["healthy", "high-protein"], prepTime: "5", budget: "$", type: "cook", ingredients: ["chickpeas", "cucumber", "tomato", "lemon", "olive oil"], tags: ["high-protein", "low-effort"], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch"] },
  { id: "74", name: "French Toast", emoji: "🍞", description: "Breakfast royalty. Crown yourself.", moods: ["comfort"], prepTime: "15", budget: "$", type: "cook", ingredients: ["bread", "eggs", "milk", "cinnamon", "syrup"], tags: [], diets: ["vegetarian"], mealTimes: ["breakfast"] },
  { id: "75", name: "Spinach & Feta Scramble", emoji: "🥬", description: "Eggs got a Mediterranean upgrade.", moods: ["healthy", "high-protein"], prepTime: "5", budget: "$", type: "cook", ingredients: ["eggs", "spinach", "feta", "olive oil"], tags: ["high-protein", "low-effort"], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["breakfast", "lunch"] },
  { id: "76", name: "Veggie Quesadilla", emoji: "🌶️", description: "Peppers, onions, cheese. Sizzle city.", moods: ["comfort", "healthy"], prepTime: "15", budget: "$", type: "cook", ingredients: ["tortilla", "bell pepper", "onion", "cheese", "salsa"], tags: [], diets: ["vegetarian"], mealTimes: ["lunch", "dinner"] },
  { id: "77", name: "Lentil Soup", emoji: "🍲", description: "Cheap, hearty, meal-prep king.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$", type: "cook", ingredients: ["lentils", "onion", "carrot", "garlic", "cumin"], tags: ["high-protein"], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "78", name: "Banana Pancakes", emoji: "🥞", description: "Two ingredients. Seriously.", moods: ["comfort", "quick"], prepTime: "15", budget: "$", type: "cook", ingredients: ["banana", "eggs"], tags: ["low-effort"], diets: ["vegetarian", "gluten-free", "dairy-free"], mealTimes: ["breakfast"] },
  { id: "79", name: "Turkey & Cheese Roll-Ups", emoji: "🧀", description: "No bread needed. Keto-friendly snack.", moods: ["quick", "high-protein"], prepTime: "5", budget: "$", type: "cook", ingredients: ["turkey slices", "cheese", "mustard"], tags: ["high-protein", "low-effort"], diets: ["gluten-free", "keto"], mealTimes: ["lunch", "snack"] },
  { id: "80", name: "Egg Drop Soup", emoji: "🥣", description: "Silky, warm, takes 5 minutes.", moods: ["healthy", "comfort"], prepTime: "5", budget: "$", type: "cook", ingredients: ["eggs", "chicken broth", "green onion", "sesame oil"], tags: ["low-effort"], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },

  // Moderate/Premium Cook
  { id: "81", name: "Teriyaki Chicken Bowl", emoji: "🍗", description: "Sweet, sticky, absolutely addictive.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["chicken thighs", "teriyaki sauce", "rice", "broccoli"], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["dinner"] },
  { id: "82", name: "Mushroom Risotto", emoji: "🍄", description: "Creamy, earthy, worth the stirring.", moods: ["comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["arborio rice", "mushrooms", "parmesan", "broth", "butter"], tags: [], diets: ["vegetarian", "gluten-free"], mealTimes: ["dinner"] },
  { id: "83", name: "Zucchini Noodles & Pesto", emoji: "🥒", description: "Low-carb pasta vibes.", moods: ["healthy"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["zucchini", "pesto", "cherry tomatoes", "pine nuts"], tags: [], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["lunch", "dinner"] },
  { id: "84", name: "BBQ Chicken Flatbread", emoji: "🍕", description: "Pizza night but make it gourmet.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$$", type: "cook", ingredients: ["flatbread", "bbq sauce", "chicken", "red onion", "cheese"], tags: ["high-protein"], diets: [], mealTimes: ["dinner"] },
  { id: "85", name: "Coconut Curry Lentils", emoji: "🥥", description: "Creamy, spicy, plant-powered.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$", type: "cook", ingredients: ["lentils", "coconut milk", "curry paste", "spinach", "rice"], tags: ["high-protein"], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["dinner"] },
  { id: "86", name: "Breakfast Burrito", emoji: "🌯", description: "All the breakfast hits, wrapped up tight.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$", type: "cook", ingredients: ["tortilla", "eggs", "cheese", "salsa", "beans"], tags: ["high-protein"], diets: ["vegetarian"], mealTimes: ["breakfast"] },
  { id: "87", name: "Cauliflower Mac & Cheese", emoji: "🥦", description: "Sneaky healthy. Still cheesy.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["cauliflower", "cheese sauce", "garlic", "breadcrumbs"], tags: [], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["lunch", "dinner"] },
  { id: "88", name: "Shrimp Scampi", emoji: "🦐", description: "Garlic butter + shrimp = date night.", moods: ["high-protein", "comfort"], prepTime: "15", budget: "$$$", type: "cook", ingredients: ["shrimp", "garlic", "butter", "white wine", "pasta", "lemon"], tags: ["high-protein"], diets: [], mealTimes: ["dinner"] },
  { id: "89", name: "Grain Bowl", emoji: "🥙", description: "Quinoa, veggies, dressing. Meal prep legend.", moods: ["healthy", "high-protein"], prepTime: "30+", budget: "$$", type: "cook", ingredients: ["quinoa", "roasted veggies", "chickpeas", "tahini"], tags: ["high-protein"], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "90", name: "Loaded Sweet Potato", emoji: "🍠", description: "Bake it, stuff it, love it.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$", type: "cook", ingredients: ["sweet potato", "black beans", "cheese", "sour cream", "salsa"], tags: ["high-protein"], diets: ["vegetarian", "gluten-free"], mealTimes: ["dinner"] },

  // More Order options
  { id: "91", name: "Shawarma", emoji: "🥙", description: "Spiced meat, pickles, garlic sauce. Chef tier.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "92", name: "Fish & Chips", emoji: "🐟", description: "Crispy batter, tartar sauce, vinegar.", moods: ["comfort", "any"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "93", name: "Fried Chicken Sandwich", emoji: "🐔", description: "Crispy, juicy, life-changing.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "94", name: "Greek Salad", emoji: "🥗", description: "Feta, olives, crunch. Mediterranean king.", moods: ["healthy"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegetarian", "gluten-free", "keto"], mealTimes: ["lunch"] },
  { id: "95", name: "Banh Mi", emoji: "🥖", description: "Vietnamese sandwich perfection.", moods: ["any", "comfort"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["dairy-free"], mealTimes: ["lunch"] },
  { id: "96", name: "Bibimbap", emoji: "🍚", description: "Korean rice bowl with all the fixings.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "97", name: "Gyros", emoji: "🥙", description: "Warm pita, seasoned meat, tzatziki.", moods: ["comfort", "high-protein"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: [], mealTimes: ["lunch", "dinner"] },
  { id: "98", name: "Smoothie Bowl", emoji: "🥝", description: "Too pretty to eat. You'll eat it anyway.", moods: ["healthy", "quick"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["breakfast", "snack"] },
  { id: "99", name: "Dumplings", emoji: "🥟", description: "Little pockets of joy.", moods: ["comfort", "any"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["dairy-free"], mealTimes: ["lunch", "dinner", "snack"] },
  { id: "100", name: "Indian Butter Chicken", emoji: "🍛", description: "Creamy, tomatoey, naan-dipping heaven.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free"], mealTimes: ["dinner"] },
  { id: "101", name: "Mediterranean Wrap", emoji: "🫔", description: "Hummus, falafel, veggies. Chef's kiss.", moods: ["healthy", "any"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["vegan", "dairy-free"], mealTimes: ["lunch"] },
  { id: "102", name: "Breakfast Sandwich", emoji: "🥪", description: "Egg, cheese, meat. Morning perfection.", moods: ["quick", "comfort", "high-protein"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: ["high-protein"], diets: [], mealTimes: ["breakfast"] },
  { id: "103", name: "Tom Yum Soup", emoji: "🍲", description: "Spicy, sour, Thai heaven.", moods: ["healthy", "comfort"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "104", name: "Tacos al Pastor", emoji: "🌮", description: "Pineapple + pork = magic.", moods: ["comfort", "any"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "105", name: "Chicken Tikka Masala", emoji: "🍛", description: "Creamy, spiced, absolute banger.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["gluten-free"], mealTimes: ["dinner"] },
  { id: "106", name: "Avocado Sushi Roll", emoji: "🍣", description: "Simple, fresh, clean.", moods: ["healthy", "quick"], prepTime: "15", budget: "$$", type: "order", ingredients: [], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "dinner"] },
  { id: "107", name: "Korean Fried Chicken", emoji: "🍗", description: "Double-fried, saucy, addictive.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$", type: "order", ingredients: [], tags: ["high-protein"], diets: ["dairy-free"], mealTimes: ["dinner"] },
  { id: "108", name: "Elote (Street Corn)", emoji: "🌽", description: "Mexican street corn. Pure street-food magic.", moods: ["comfort", "quick"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["vegetarian", "gluten-free"], mealTimes: ["snack"] },
  { id: "109", name: "Lamb Gyro Plate", emoji: "🥩", description: "Seasoned lamb, warm pita, all the sides.", moods: ["comfort", "high-protein"], prepTime: "30+", budget: "$$$", type: "order", ingredients: [], tags: ["high-protein"], diets: [], mealTimes: ["dinner"] },
  { id: "110", name: "Veggie Spring Rolls", emoji: "🥬", description: "Light, fresh, dip-worthy.", moods: ["healthy", "quick"], prepTime: "15", budget: "$", type: "order", ingredients: [], tags: [], diets: ["vegan", "gluten-free", "dairy-free"], mealTimes: ["lunch", "snack"] },
];

const budgetCostMap: Record<Budget, string> = { "$": "Under $5", "$$": "$5–15", "$$$": "$15+" };
const prepTimeMap: Record<PrepTime, string> = { "5": "~5 min", "15": "~15 min", "30+": "30+ min" };

export function getCostLabel(budget: Budget) { return budgetCostMap[budget]; }
export function getPrepLabel(time: PrepTime) { return prepTimeMap[time]; }

export interface UserPreferences {
  budget: Budget;
  mood: Mood;
  prepTime: PrepTime;
  mealType: MealType | "any";
  diets: Diet[];
}

export function getCurrentMealTime(): MealTime {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 14) return "lunch";
  if (hour >= 14 && hour < 17) return "snack";
  if (hour >= 17 && hour < 22) return "dinner";
  return "snack"; // late night
}

export function getTimeGreeting(): { greeting: string; emoji: string; mealTime: MealTime } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return { greeting: "Good morning", emoji: "☀️", mealTime: "breakfast" };
  if (hour >= 11 && hour < 14) return { greeting: "Lunchtime", emoji: "🌤️", mealTime: "lunch" };
  if (hour >= 14 && hour < 17) return { greeting: "Afternoon snack?", emoji: "🌅", mealTime: "snack" };
  if (hour >= 17 && hour < 22) return { greeting: "Dinner time", emoji: "🌙", mealTime: "dinner" };
  return { greeting: "Late night cravings?", emoji: "🦉", mealTime: "snack" };
}

export function recommendMeal(prefs: UserPreferences, excludeIds: string[] = []): Meal | null {
  const currentMealTime = getCurrentMealTime();

  const filter = (relaxMood = false, relaxTime = false, relaxBudget = false, relaxDiet = false, relaxMealTime = false) => {
    return meals.filter((m) => {
      if (excludeIds.includes(m.id)) return false;
      if (!relaxBudget && m.budget !== prefs.budget) return false;
      if (!relaxMood && prefs.mood !== "any" && !m.moods.includes(prefs.mood)) return false;
      if (!relaxTime && m.prepTime !== prefs.prepTime) return false;
      if (prefs.mealType !== "any" && m.type !== prefs.mealType) return false;
      if (!relaxDiet && prefs.diets.length > 0 && !prefs.diets.every((d) => m.diets.includes(d))) return false;
      if (!relaxMealTime && !m.mealTimes.includes(currentMealTime) && !m.mealTimes.includes("anytime")) return false;
      return true;
    });
  };

  // Try with meal time bias first, then relax
  const strategies = [
    () => filter(false, false, false, false, false),
    () => filter(false, true, false, false, false),
    () => filter(false, false, true, false, false),
    () => filter(true, false, false, false, false),
    () => filter(false, false, false, false, true), // relax meal time
    () => filter(true, true, false, false, true),
    () => filter(false, true, true, false, true),
    () => filter(true, false, true, false, true),
    () => filter(true, true, true, false, true),
    () => filter(true, true, true, true, true), // relax diet last
  ];

  for (const strategy of strategies) {
    const results = strategy();
    if (results.length > 0) {
      return results[Math.floor(Math.random() * results.length)];
    }
  }

  return null;
}

const explanations: Record<string, string[]> = {
  "quick-$": ["Fast and cheap — your wallet and schedule both win.", "No time, no money, no problem."],
  "quick-$$": ["Quick with a bit of flair. You've earned it.", "Speed meets quality. Efficient king/queen."],
  "quick-$$$": ["Quick AND fancy? Living the dream.", "Time is money, and you're spending both wisely."],
  "healthy-$": ["Healthy on a budget. Your body thanks you.", "Clean eating, clean wallet."],
  "healthy-$$": ["Nutritious and delicious. The sweet spot.", "Balanced life, balanced meal."],
  "healthy-$$$": ["Premium health fuel. Invest in yourself.", "Top-tier nutrition. You're worth it."],
  "comfort-$": ["Cheap comfort. Sometimes simple is perfect.", "Cozy vibes on a budget. No shame."],
  "comfort-$$": ["Comfort food done right. Treat yourself.", "Warm, filling, and just right."],
  "comfort-$$$": ["Luxury comfort food? You absolute legend.", "Go big on the comfort. Life's short."],
  "high-protein-$": ["Gains on a budget. Gym bros approve.", "Protein without the price tag."],
  "high-protein-$$": ["Solid protein, fair price. Smart choice.", "Fueling up properly. Respect."],
  "high-protein-$$$": ["Premium protein. Your muscles deserve the best.", "Elite fuel for elite performance."],
  "any-$": ["Cheap and easy. Can't go wrong.", "Whatever works. No judgment here."],
  "any-$$": ["A solid middle ground. Can't go wrong.", "Good food, fair price. The sweet spot."],
  "any-$$$": ["Feeling fancy? Why not. You deserve it.", "Splurge mode activated."],
};

export function getExplanation(mood: Mood, budget: Budget): string {
  const key = `${mood}-${budget}`;
  const options = explanations[key] || ["Great pick! This one's a winner."];
  return options[Math.floor(Math.random() * options.length)];
}
