import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: "🤔",
    title: "Can't decide what to eat?",
    subtitle: "We've all been there. Staring at the fridge, scrolling through apps, still hungry. Bite fixes that.",
    bg: "from-primary/[0.06] to-transparent",
  },
  {
    emoji: "⚡",
    title: "A few taps. One answer.",
    subtitle: "Tell us your mood, budget, and time. Bite picks the perfect meal for you in seconds.",
    bg: "from-success/[0.06] to-transparent",
  },
  {
    emoji: "🍽️",
    title: "Just bite.",
    subtitle: "No endless lists. No overthinking. One solid pick you'll actually want to eat.",
    bg: "from-accent/[0.1] to-transparent",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    haptic("light");
    if (current === slides.length - 1) {
      onComplete();
    } else {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  };

  const handleSkip = () => {
    haptic("light");
    onComplete();
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6">
      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 mt-safe text-sm text-muted-foreground active:text-foreground transition-colors px-3 py-2 min-h-[44px] z-10"
      >
        Skip
      </button>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -80 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${slide.bg} flex items-center justify-center mb-8`}>
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="text-6xl"
            >
              {slide.emoji}
            </motion.span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            {slide.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
            {slide.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2 mt-10 mb-8">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === current ? 24 : 8,
              backgroundColor: i === current ? "hsl(var(--primary))" : "hsl(var(--secondary))",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleNext}
        className="w-full max-w-sm py-4 min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-all duration-200 ease-out"
      >
        {current === slides.length - 1 ? "Let's go! 🚀" : "Next"}
      </motion.button>
    </div>
  );
}
