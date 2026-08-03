import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const chips = ["Doubts", "DMs", "Groups", "Channels", "AI"];

const PrepChatPromo = () => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 my-6">
      <motion.button
        onClick={() => navigate("/prepchat/feed")}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-fuchsia-500/15 backdrop-blur-xl px-4 py-3.5 text-left shadow-[0_0_28px_-8px_hsl(var(--primary))]"
      >
        {/* moving light sweep */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-md"
          animate={{ x: ["0%", "400%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
        {/* glow orbs */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-6 w-28 h-28 rounded-full bg-primary/30 blur-3xl"
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-4 w-28 h-28 rounded-full bg-fuchsia-500/25 blur-3xl"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />

        <div className="relative flex items-center gap-3">
          <motion.span
            className="w-10 h-10 shrink-0 rounded-xl bg-primary/20 text-primary grid place-items-center"
            animate={{ boxShadow: ["0 0 0px hsl(var(--primary)/0.6)", "0 0 18px hsl(var(--primary)/0.9)", "0 0 0px hsl(var(--primary)/0.6)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black leading-tight">
              PrepChat is live <span className="text-primary">— chat, post doubts, follow toppers</span>
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {chips.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-background/60 border border-border/60 text-[10px] font-bold text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 px-3 h-9 rounded-full bg-primary text-primary-foreground text-xs font-black">
            Open <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.button>
    </section>
  );
};

export default PrepChatPromo;
