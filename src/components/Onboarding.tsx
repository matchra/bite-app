import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "@/lib/haptics";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: "🤔",
    title: "Can't decide\nwhat to eat?",
    subtitle: "We've all been there.",
  },
  {
    emoji: "⚡",
    title: "A few taps.\nThat's it.",
    subtitle: "Mood, budget, time — done in seconds.",
  },
  {
    emoji: "🍽️",
    title: "One meal.\nNo overthinking.",
    subtitle: "A recommendation you'll actually want.",
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
    <div className="fixed inset-0 z-[100] bg-background flex flex-col px-8 pt-safe">
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground active:text-foreground transition-colors px-3 py-2 min-h-[44px]"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="text-5xl block mb-8"
            >
              {slide.emoji}
            </motion.span>

            <h2 className="font-display text-[32px] font-bold text-foreground leading-[1.15] whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-muted-foreground text-base mt-4 max-w-[280px]">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-10">
        <div className="flex gap-1.5 mb-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full"
              animate={{
                width: i === current ? 32 : 8,
                backgroundColor: i === current ? "hsl(var(--foreground))" : "hsl(var(--border))",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="w-full py-4 min-h-[56px] rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:opacity-90 transition-opacity"
        >
          {current === slides.length - 1 ? "Get started" : "Continue"}
        </motion.button>
      </div>
    </div>
  );
}
