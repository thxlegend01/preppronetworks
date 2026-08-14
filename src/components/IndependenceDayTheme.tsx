import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIndependenceDay, INDEPENDENCE_DAY } from "@/hooks/useIndependenceDay";
import prepproLogo from "@/assets/preppro-logo.jpg";

const SAFFRON = "#FF9933";
const GREEN = "#138808";
const NAVY = "#000080";

const AshokaChakra = ({ size = 44 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <circle cx="50" cy="50" r="44" fill="none" stroke={NAVY} strokeWidth="5" />
    <circle cx="50" cy="50" r="7" fill={NAVY} />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="8"
        stroke={NAVY}
        strokeWidth="2.4"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </svg>
);

/** Tricolor confetti / floating petals */
const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 6,
        size: 5 + Math.random() * 7,
        color: [SAFFRON, "#ffffff", GREEN][i % 3],
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            opacity: 0.75,
            boxShadow: `0 0 8px ${p.color}66`,
          }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: "110vh", x: p.drift, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const IndependenceDayTheme = () => {
  const active = useIndependenceDay();
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const key = `id-greeting-${INDEPENDENCE_DAY}`;
    if (!sessionStorage.getItem(key)) {
      const t = setTimeout(() => setShowGreeting(true), 900);
      return () => clearTimeout(t);
    }
  }, [active]);

  const dismiss = () => {
    sessionStorage.setItem(`id-greeting-${INDEPENDENCE_DAY}`, "1");
    setShowGreeting(false);
  };

  if (!active) return null;

  return (
    <>
      {/* Tricolor ribbon pinned to the very top */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-[5px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${SAFFRON} 0%, ${SAFFRON} 33%, #ffffff 33%, #ffffff 66%, ${GREEN} 66%, ${GREEN} 100%)`,
        }}
        aria-hidden
      />

      <Confetti />

      <AnimatePresence>
        {showGreeting && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-5 bg-background/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          >
            <motion.div
              role="dialog"
              aria-label="Happy Independence Day from PrepPro Network"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden glass-card p-7 text-center"
              style={{ boxShadow: `0 24px 70px -20px ${SAFFRON}55, 0 0 0 1px ${GREEN}22` }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background: `linear-gradient(90deg, ${SAFFRON} 0%, ${SAFFRON} 33%, #ffffff 33%, #ffffff 66%, ${GREEN} 66%, ${GREEN} 100%)`,
                }}
              />

              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <motion.div
                className="mx-auto mb-4 w-fit"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                <AshokaChakra size={56} />
              </motion.div>

              <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
                15 August 2026
              </p>
              <h2 className="text-3xl font-black leading-tight mb-1" style={{ color: SAFFRON }}>
                Happy
              </h2>
              <h2 className="text-3xl font-black leading-tight mb-3" style={{ color: GREEN }}>
                Independence Day
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Freedom was earned with courage — your rank will be too. Wishing every aspirant a
                proud 80th Independence Day.
              </p>

              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
                  <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-foreground">— from PrepPro Network 🇮🇳</span>
              </div>

              <button
                onClick={dismiss}
                className="w-full h-12 rounded-2xl font-bold text-white transition-transform active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${SAFFRON}, ${GREEN})` }}
              >
                Jai Hind 🇮🇳
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IndependenceDayTheme;