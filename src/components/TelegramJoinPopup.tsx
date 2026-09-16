import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, CheckCircle2, Users } from "lucide-react";

const TELEGRAM_LINK = "https://t.me/+Vaaty3NWsRIzOThl";

const SECTION_LABELS: Record<string, string> = {
  "/apps": "Study Apps",
  "/test-series": "Test Series",
  "/study-material": "Study Material",
  "/study-tracker": "Study Tracker",
  "/prepchat": "PrepChat",
  "/study-tools": "Study Tools",
  "/entertainment": "Entertainment",
  "/community": "Community",
};

const TelegramJoinPopup = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    const isHome = path === "/" || path === "/index";
    const sectionLabel = SECTION_LABELS[path];

    if (!isHome && !sectionLabel) return;

    const key = isHome ? "tg-popup-site" : `tg-popup-${path}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable */
    }

    setSection(isHome ? null : sectionLabel ?? null);
    const timer = setTimeout(() => setOpen(true), isHome ? 1800 : 1200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const close = () => setOpen(false);

  const join = () => {
    window.open(TELEGRAM_LINK, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-sky-500/40 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-sky-950/95 dark:via-background dark:to-blue-950/90 p-6 shadow-2xl shadow-sky-500/30 overflow-hidden"
          >
            {/* glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute -inset-3 bg-sky-500/30 blur-2xl rounded-full" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/40 ring-2 ring-white/40">
                  <Send className="w-8 h-8 text-white" strokeWidth={2.4} />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/15 px-2.5 py-1 rounded-full mb-3">
                <Users className="w-3 h-3" /> Free Updates
              </span>

              <h3 className="text-xl font-black text-foreground leading-tight mb-1.5">
                Join PrepPro Network on Telegram
              </h3>
              <p className="text-sm text-muted-foreground leading-snug mb-6">
                {section
                  ? `Get instant ${section} updates, new links & alerts — straight to your Telegram.`
                  : "New apps, test series, study material & instant alerts — never miss an update."}
              </p>

              <div className="w-full space-y-2.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={join}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/40 hover:shadow-sky-500/60 transition-shadow"
                >
                  <Send className="w-4 h-4" strokeWidth={2.6} />
                  Join Now
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={close}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-border/60 bg-muted/40 px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/70 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Already Joined (Continue)
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TelegramJoinPopup;
