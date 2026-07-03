import { ArrowRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumGlassCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  cta?: string;
  accent?: "magenta" | "purple" | "cyan" | "blend";
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const accentMap = {
  magenta: "from-fuchsia-500 to-pink-600",
  purple: "from-violet-500 to-purple-600",
  cyan: "from-cyan-400 to-blue-500",
  blend: "from-fuchsia-500 via-purple-500 to-cyan-400",
};

/**
 * Premium glassmorphic card — dark/light-aware, neon-edge hover glow,
 * icon capsule, and animated arrow. Use as the base for all resource-style
 * cards across the app for a consistent premium feel.
 */
const PremiumGlassCard = forwardRef<HTMLButtonElement, PremiumGlassCardProps>(
  ({ icon: Icon, title, subtitle, description, badge, cta = "Explore", accent = "blend", onClick, children, className }, ref) => {
    const grad = accentMap[accent];
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.985 }}
        className={cn(
          "glass-premium group w-full text-left p-5 sm:p-6 flex flex-col gap-4",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {Icon && (
            <div className="relative">
              <div className={cn("absolute -inset-2 rounded-2xl blur-2xl opacity-40 bg-gradient-to-br", grad)} />
              <div className={cn("relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg ring-1 ring-white/10", grad)}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />
              </div>
            </div>
          )}
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur text-foreground/80">
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs sm:text-sm font-semibold neon-text">{subtitle}</p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{description}</p>
          )}
        </div>

        {children}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
            {cta}
          </span>
          <span className={cn("w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br shadow-md transition-transform duration-500 group-hover:translate-x-1", grad)}>
            <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
        </div>
      </motion.button>
    );
  },
);
PremiumGlassCard.displayName = "PremiumGlassCard";
export default PremiumGlassCard;