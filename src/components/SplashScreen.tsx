import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import appIcon from "@/assets/app-icon-full.png";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("out"), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {phase === "in" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[200] bg-gradient-to-br from-[hsl(24,82%,54%)] to-[hsl(36,90%,55%)] flex flex-col items-center justify-center"
        >
          <motion.img
            src={appIcon}
            alt="Bite"
            width={120}
            height={120}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="drop-shadow-2xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-5 font-display text-2xl font-bold text-white tracking-tight"
          >
            Bite
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mt-1 text-sm text-white/70 font-medium"
          >
            Decide what to eat
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
