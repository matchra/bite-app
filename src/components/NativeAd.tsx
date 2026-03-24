import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type AdVariant = "inline" | "banner" | "interstitial";

interface NativeAdProps {
  variant?: AdVariant;
  context?: string;
}

const AD_POOL = [
  { title: "Meal prep made easy", desc: "Get fresh ingredients delivered weekly.", cta: "Try free", emoji: "📦", link: "#sponsor" },
  { title: "Track your nutrition", desc: "Log meals in seconds with AI.", cta: "Get app", emoji: "📊", link: "#sponsor" },
  { title: "Healthy snacks box", desc: "Curated snacks to your door monthly.", cta: "Subscribe", emoji: "🥜", link: "#sponsor" },
  { title: "Kitchen gadgets sale", desc: "Up to 40% off top-rated tools.", cta: "Shop now", emoji: "🍳", link: "#sponsor" },
  { title: "Cooking class online", desc: "Learn new recipes from real chefs.", cta: "Start free", emoji: "👨‍🍳", link: "#sponsor" },
];

function getAd(context?: string) {
  const seed = context ? context.charCodeAt(0) : Math.floor(Math.random() * AD_POOL.length);
  return AD_POOL[seed % AD_POOL.length];
}

export default function NativeAd({ variant = "inline", context }: NativeAdProps) {
  const ad = getAd(context);

  if (variant === "banner") {
    return (
      <motion.a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="block mx-5 mb-4 bg-card rounded-2xl border border-border p-3.5 active:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0">{ad.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-card-foreground truncate">{ad.title}</p>
            <p className="text-[10px] text-muted-foreground truncate">{ad.desc}</p>
          </div>
          <span className="text-[10px] font-semibold text-primary whitespace-nowrap">{ad.cta}</span>
        </div>
        <p className="text-[8px] text-muted-foreground/40 mt-1.5 text-right">Sponsored</p>
      </motion.a>
    );
  }

  if (variant === "interstitial") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm mx-auto"
      >
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-card rounded-3xl border border-border p-6 text-center shadow-lg active:bg-muted/50 transition-colors"
        >
          <span className="text-4xl inline-block mb-3">{ad.emoji}</span>
          <p className="font-display font-bold text-lg text-card-foreground">{ad.title}</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">{ad.desc}</p>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold">
            {ad.cta} <ExternalLink className="w-3.5 h-3.5" />
          </span>
          <p className="text-[8px] text-muted-foreground/40 mt-3">Sponsored</p>
        </a>
      </motion.div>
    );
  }

  // Default: inline
  return (
    <motion.a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      className="block w-full bg-card rounded-2xl border border-border p-4 mt-4 active:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">{ad.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground">{ad.title}</p>
          <p className="text-xs text-muted-foreground">{ad.desc}</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-primary whitespace-nowrap">
          {ad.cta} <ExternalLink className="w-3 h-3" />
        </span>
      </div>
      <p className="text-[8px] text-muted-foreground/40 mt-2 text-right">Sponsored</p>
    </motion.a>
  );
}
