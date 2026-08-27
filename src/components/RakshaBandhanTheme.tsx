import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRakshaBandhan, RAKSHA_BANDHAN } from "@/hooks/useRakshaBandhan";
import prepproLogo from "@/assets/preppro-logo.jpg";

const ROSE = "#E63971";
const GOLD = "#F5B301";
const DEEP = "#7A1F4B";

/** Decorative rakhi thread + flower medallion */
const Rakhi = ({ size = 56 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <circle cx="50" cy="50" r="30" fill="none" stroke={GOLD} strokeWidth="3" />
    {Array.from({ length: 12 }).map((_, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="22"
        rx="7"
        ry="13"
        fill={ROSE}
        opacity="0.85"
        transform={`rotate(${i * 30} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="13" fill={GOLD} />
    <circle cx="50" cy="50" r="6" fill={DEEP} />
  </svg>
);

/** Falling rose/gold petals */
const Petals = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 6,
        size: 6 + Math.random() * 8,
        color: [ROSE, GOLD, "#FF8FB1"][i % 3],
        drift: (Math.random() - 0.5) * 90,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.7,
            borderRadius: "50% 0 50% 50%",
            boxShadow: `0 0 10px ${p.color}66`,
          }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: "110vh", x: p.drift, rotate: 420 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const RakshaBandhanTheme = () => {
  const active = useRakshaBandhan();
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const key = `rb-greeting-${RAKSHA_BANDHAN}`;
    if (!sessionStorage.getItem(key)) {
      const t = setTimeout(() => setShowGreeting(true), 900);
      return () => clearTimeout(t);
    }
  }, [active]);

  const dismiss = () => {
    sessionStorage.setItem(`rb-greeting-${RAKSHA_BANDHAN}`, "1");
    setShowGreeting(false);
  };

  if (!active) return null;

  return (
    <>
      {/* Rakhi thread ribbon pinned to the top */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-[5px] pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${ROSE}, ${GOLD}, ${ROSE}, ${GOLD})` }}
        aria-hidden
      />

      <Petals />

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
              aria-label="Happy Raksha Bandhan from PrepPro Network"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden glass-card p-7 text-center"
              style={{ boxShadow: `0 24px 70px -20px ${ROSE}55, 0 0 0 1px ${GOLD}33` }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: `linear-gradient(90deg, ${ROSE}, ${GOLD}, ${ROSE})` }}
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
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              >
                <Rakhi size={64} />
              </motion.div>

              <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
                28 August 2026
              </p>
              <h2 className="text-3xl font-black leading-tight mb-1" style={{ color: ROSE }}>
                Happy
              </h2>
              <h2 className="text-3xl font-black leading-tight mb-3" style={{ color: GOLD }}>
                Raksha Bandhan
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                A thread of love, a promise of protection. May your bond stay strong and your
                preparation stronger. 🎀
              </p>

              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
                  <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-foreground">— from PrepPro Network 🎀</span>
              </div>

              <button
                onClick={dismiss}
                className="w-full h-12 rounded-2xl font-bold text-white transition-transform active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${ROSE}, ${GOLD})` }}
              >
                Celebrate 🎀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RakshaBandhanTheme;
