import { Send, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  url: string;
  label?: string;
  compact?: boolean;
}

/**
 * Prominent Telegram Channel join CTA used alongside the WhatsApp banner.
 */
const TelegramChannelBanner = ({ url, label = "Study Updates Channel", compact = false }: Props) => {
  if (compact) {
    return (
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.98 }}
        className="group relative mx-auto -mt-1 mb-1 flex w-[94%] items-center justify-between gap-2 rounded-b-2xl rounded-t-md border border-sky-500/60 border-t-0 bg-gradient-to-r from-sky-500/30 via-blue-500/25 to-cyan-500/25 px-3 py-2 shadow-md shadow-sky-500/20 backdrop-blur-sm transition-all hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/30"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm ring-1 ring-white/40">
            <Send className="w-3.5 h-3.5 text-white" strokeWidth={2.6} />
          </div>
          <span className="text-[12px] font-bold text-foreground truncate">
            Join Telegram Channel — <span className="text-sky-700 dark:text-sky-300">{label}</span>
          </span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-0.5 text-[11px] font-black text-white bg-sky-600 px-2 py-0.5 rounded-full shadow-sm">
          Join <ArrowRight className="w-3 h-3" />
        </span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="group relative block mb-6 overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-cyan-500/10 p-4 sm:p-5 shadow-lg shadow-sky-500/10 hover:border-sky-500/60 transition-all"
    >
      {/* Animated glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/25 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-400 via-blue-500 to-cyan-500" />

      <div className="relative flex items-center gap-4">
        <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/40 ring-2 ring-white/30">
          <Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.4} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 bg-sky-500/15 px-2 py-0.5 rounded-full">
              Join Request
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <Users className="w-3 h-3" /> Free
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-foreground leading-tight truncate">
            Telegram Channel — {label}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Tap to follow PrepPro Network on Telegram for instant updates.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full bg-sky-500 text-white text-xs font-bold shadow-md group-hover:translate-x-1 transition-transform">
          Join
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.a>
  );
};

export default TelegramChannelBanner;
