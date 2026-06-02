import { motion } from "framer-motion";
import { ArrowRight, Heart, MessageCircleMore, ImageIcon } from "lucide-react";

interface ResourceListRowProps {
  index: number;
  title: string;
  subtitle?: string;
  logo?: string;
  isFavorite?: boolean;
  isComingSoon?: boolean;
  badge?: string;
  whatsappUrl?: string;
  onToggleFavorite?: () => void;
  onOpen: () => void;
}

/**
 * Bold numbered list row inspired by editorial "only X you need" lists.
 * Big tap target, circular logo, optional WhatsApp side action, animated arrow.
 */
const ResourceListRow = ({
  index,
  title,
  subtitle,
  logo,
  isFavorite,
  isComingSoon,
  badge,
  whatsappUrl,
  onToggleFavorite,
  onOpen,
}: ResourceListRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Divider line */}
      <div className="absolute inset-x-0 top-0 h-px bg-border/50" />

      <div className="flex items-center gap-4 md:gap-6 py-5 md:py-7 pr-2 md:pr-4">
        {/* Index */}
        <span className="w-8 md:w-10 shrink-0 text-xs md:text-sm font-mono font-semibold text-muted-foreground/60 tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Logo */}
        <button
          onClick={onOpen}
          disabled={isComingSoon}
          className="shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-card border-2 border-border shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/40 disabled:opacity-60"
          aria-label={`Open ${title}`}
        >
          {logo ? (
            <img src={logo} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </button>

        {/* Title */}
        <button
          onClick={onOpen}
          disabled={isComingSoon}
          className="flex-1 min-w-0 text-left disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg md:text-3xl font-black tracking-tight text-foreground uppercase truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary uppercase tracking-wider">
                {badge}
              </span>
            )}
            {isComingSoon && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning uppercase tracking-wider">
                Soon
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </button>

        {/* Side actions */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`hidden sm:inline-flex p-2 rounded-full transition-colors ${
                isFavorite
                  ? "bg-destructive/15 text-destructive"
                  : "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
              }`}
              aria-label="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
          {whatsappUrl && !isComingSoon && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-green-500 border border-green-500/30 hover:bg-green-500/10 transition-colors"
              aria-label="Join WhatsApp Channel"
            >
              <MessageCircleMore className="w-4 h-4" />
              Channel
            </a>
          )}
          <button
            onClick={onOpen}
            disabled={isComingSoon}
            className="p-2 md:p-3 rounded-full text-muted-foreground/70 group-hover:text-primary group-hover:translate-x-1 transition-all disabled:opacity-40"
            aria-label={`Open ${title}`}
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceListRow;