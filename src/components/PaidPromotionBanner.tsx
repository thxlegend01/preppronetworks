import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Globe, Smartphone, Send, MessageCircle, ArrowRight, X, Sparkles } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/PrepProBot";
const STORAGE_KEY = "preppro_paid_promo_start";
const DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

const channels = [
  { icon: Globe, label: "Website" },
  { icon: Smartphone, label: "App" },
  { icon: Send, label: "Telegram" },
  { icon: MessageCircle, label: "WhatsApp" },
];

const PaidPromotionBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [remaining, setRemaining] = useState<string>("");

  useEffect(() => {
    const startStr = localStorage.getItem(STORAGE_KEY);
    let start = startStr ? parseInt(startStr, 10) : NaN;
    if (!startStr || Number.isNaN(start)) {
      start = Date.now();
      localStorage.setItem(STORAGE_KEY, String(start));
    }
    const end = start + DURATION_MS;

    const tick = () => {
      const left = end - Date.now();
      if (left <= 0) {
        setVisible(false);
        return;
      }
      setVisible(true);
      const h = Math.floor(left / (1000 * 60 * 60));
      const m = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((left % (1000 * 60)) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    // force-hide for the remainder of the session
    localStorage.setItem(STORAGE_KEY, String(Date.now() - DURATION_MS));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.section
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="relative mx-auto w-[94%] max-w-3xl mt-3 mb-2"
        >
          <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-pink-500/10 to-fuchsia-500/10 p-[1px] shadow-2xl shadow-primary/20 backdrop-blur-xl">
            {/* animated glow */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/30 blur-3xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-pink-500/25 blur-3xl"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative rounded-3xl bg-card/40 backdrop-blur-md px-4 sm:px-6 py-5">
              {/* close */}
              <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-background/60 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-background/80 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* header */}
              <div className="flex items-center gap-2 mb-3">
                <motion.span
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-pink-500 shadow-lg shadow-primary/40"
                >
                  <Megaphone className="h-5 w-5 text-white" strokeWidth={2.4} />
                </motion.span>
                <div className="flex flex-col">
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" /> Paid Promotion
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-foreground leading-tight">
                    Paid Promotion Available
                  </h2>
                </div>
              </div>

              <p className="text-[13px] sm:text-sm text-muted-foreground mb-3 pr-6">
                Want to grow your Business, Course, App or Channel? We'll promote you to real,
                active students & a tech-savvy audience — at the best price with fast support.
              </p>

              {/* channels */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {channels.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-border/30 bg-background/40 px-1 py-2 text-center"
                  >
                    <Icon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                    <span className="text-[10px] font-semibold text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* timer */}
              <div className="mb-4 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5">
                <span className="text-[11px] font-semibold text-primary">⏳ Offer ends in</span>
                <span className="text-[12px] font-black tabular-nums text-primary">{remaining}</span>
              </div>

              {/* CTA */}
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white text-sm font-bold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" strokeWidth={2.4} />
                Message us on Telegram — @PrepProBot
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default PaidPromotionBanner;
