import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import appIcon from "@/assets/app-icon-full.png";
import screenHome from "@/assets/landing-home.png";
import screenResult from "@/assets/landing-result.png";
import screenMyEats from "@/assets/landing-myeats.png";

/* ──────────────────── Fade-up wrapper ──────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────── Screenshot carousel ──────────────────── */
const screenshots = [
  { src: screenHome, alt: "Bite home screen — pick your vibe" },
  { src: screenResult, alt: "Bite result — your meal decided" },
  { src: screenMyEats, alt: "Bite My Eats — saved meals and history" },
];

function ScreenshotCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (idx: number) => {
    setActive(idx);
    scrollRef.current?.children[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.children[0]?.clientWidth || 1;
      const idx = Math.round(scrollLeft / (cardWidth + 16));
      setActive(Math.min(idx, screenshots.length - 1));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {screenshots.map((s, i) => (
          <div key={i} className="flex-shrink-0 snap-center w-[260px]">
            <div className="rounded-[2rem] overflow-hidden shadow-xl border-[6px] border-foreground/10 bg-card" style={{ aspectRatio: "390/844" }}>
              <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === active ? "bg-primary w-6" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────── Testimonials ──────────────────── */
const testimonials = [
  { name: "Sarah K.", text: "I literally saved 20 minutes today just by tapping one button. No more staring at my fridge.", rating: 5 },
  { name: "Jake T.", text: "This app gets me. Comfort food on a budget? Done in 3 seconds.", rating: 5 },
  { name: "Priya M.", text: "My partner and I use it every night. No more 'I don't know, what do you want?' arguments.", rating: 5 },
];

/* ──────────────────── Landing page ──────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">

      {/* ────── HERO ────── */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <FadeUp>
          <motion.img
            src={appIcon}
            alt="Bite app icon"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-2xl shadow-lg"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          />
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight max-w-[340px] mx-auto">
            Stop thinking.<br />Just eat.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-[320px] mx-auto leading-relaxed">
            Bite decides what you should eat in seconds — based on your mood, time, and budget.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="flex flex-col gap-3 mt-8 w-full max-w-[300px]">
          <Link
            to="/try"
            onClick={() => trackEvent("try_now_click")}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-all duration-200 text-center"
          >
            Try it now
          </Link>
          <a
            href="#download"
            onClick={() => trackEvent("download_click")}
            className="w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-display font-semibold text-sm active:bg-secondary/70 transition-all duration-200 text-center flex items-center justify-center gap-2"
          >
            Download the app <ArrowRight className="w-4 h-4" />
          </a>
        </FadeUp>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 text-muted-foreground/40"
        >
          <ChevronRight className="w-5 h-5 rotate-90" />
        </motion.div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <FadeUp>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider text-center mb-2">How it works</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground">
            3 taps. That's it.
          </h2>
        </FadeUp>

        <div className="mt-10 space-y-5">
          {[
            { step: "1", emoji: "⚡", title: "Pick your vibe", desc: "Quick, healthy, comfort, or surprise me." },
            { step: "2", emoji: "⏱️", title: "Set your constraints", desc: "How much time and money you've got." },
            { step: "3", emoji: "🍽️", title: "Get your meal", desc: "One perfect answer. Instantly." },
          ].map((item, i) => (
            <FadeUp key={item.step} delay={i * 0.1}>
              <div className="flex items-start gap-4 bg-card rounded-2xl p-5 border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {item.emoji}
                </div>
                <div>
                  <p className="font-display font-semibold text-card-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ────── APP PREVIEW ────── */}
      <section className="py-16">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider text-center mb-2">See it in action</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 px-6">
          Simple, clean, and fast
        </h2>
        <ScreenshotCarousel />
      </section>

      {/* ────── WHY BITE ────── */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <FadeUp>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider text-center mb-2">Why Bite?</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
            Pick less. Eat faster.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "🚫", text: "No recipes to scroll" },
            { emoji: "🧠", text: "No overthinking" },
            { emoji: "✅", text: "One clear answer" },
            { emoji: "⚡", text: "Fast, simple, done" },
            { emoji: "🍳", text: "Cook or order — it decides" },
            { emoji: "🔒", text: "100% private" },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="bg-card rounded-2xl p-4 border border-border text-center">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-medium text-card-foreground mt-2">{item.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ────── SOCIAL PROOF ────── */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-lg mx-auto">
          <FadeUp>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider text-center mb-2">What people say</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
              People are using Bite to decide faster
            </h2>
          </FadeUp>

          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">"{t.text}"</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">— {t.name}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="flex gap-3 mt-8">
              {[
                { value: "10K+", label: "meals decided" },
                { value: "4.9★", label: "average rating" },
                { value: "3 sec", label: "avg decision time" },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
                  <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ────── FINAL CTA ────── */}
      <section className="px-6 py-20 text-center">
        <FadeUp>
          <div className="max-w-sm mx-auto">
            <motion.span
              className="text-5xl inline-block mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🤔
            </motion.span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Still thinking about what to eat?
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              No thinking required. Let Bite decide.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/try"
                onClick={() => trackEvent("try_now_click")}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base shadow-lg shadow-primary/25 active:bg-primary/90 transition-all duration-200 text-center"
              >
                Let Bite decide
              </Link>
              <a
                href="#download"
                onClick={() => trackEvent("download_click")}
                className="w-full py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-display font-semibold text-sm active:bg-secondary/70 transition-all duration-200 text-center"
              >
                Download the app
              </a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={appIcon} alt="Bite" width={28} height={28} className="rounded-lg" />
            <span className="font-display font-bold text-foreground">Bite</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/try" className="hover:text-foreground transition-colors">Try App</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            © {new Date().getFullYear()} Bite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
