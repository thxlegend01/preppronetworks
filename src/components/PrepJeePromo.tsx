import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, Sparkles } from "lucide-react";

const PREPJEE_URL = "https://prepjee.lovable.app";

/**
 * Marquee-style red disclaimer ribbon promoting PrepJee — inspired by warning ribbons.
 * Tap to open in a new tab.
 */
const PrepJeePromo = () => {
  return (
    <section className="py-3 relative z-30">
      <a
        href={PREPJEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden border-y-2 border-red-700/50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-[0_0_30px_rgba(239,68,68,0.35)]"
      >
        {/* Diagonal hazard stripes overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 14px, rgba(0,0,0,0.35) 14px 22px)",
          }}
        />

        {/* Scrolling marquee */}
        <div className="relative flex overflow-hidden whitespace-nowrap py-2.5">
          <motion.div
            className="flex shrink-0 items-center gap-8 pl-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white">
                    <AlertTriangle className="w-4 h-4 text-yellow-300 fill-yellow-300/30 shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                      New Platform Launch — <span className="text-yellow-200">PrepJee</span> by PrepPro Network
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span className="text-xs sm:text-sm font-semibold opacity-95">
                      Best for solving PYQs • prepjee.lovable.app
                    </span>
                    <span className="text-white/60">•</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA pill (pinned right on md+) */}
        <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-red-600 text-xs font-black shadow-lg group-hover:scale-105 transition-transform">
          Open PrepJee
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>
    </section>
  );
};

export default PrepJeePromo;