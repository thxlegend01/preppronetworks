import { motion } from "framer-motion";
import { useIndependenceDay } from "@/hooks/useIndependenceDay";

const SAFFRON = "#FF9933";
const GREEN = "#138808";

/** Homepage wish banner — visible only on 15 August 2026 (IST). */
const IndependenceDayBanner = () => {
  const active = useIndependenceDay();
  if (!active) return null;

  return (
    <section className="container mx-auto px-4 pt-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl glass-card p-5 sm:p-7 text-center"
        style={{ boxShadow: `0 20px 60px -24px ${SAFFRON}66` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${SAFFRON} 0%, ${SAFFRON} 33%, #ffffff 33%, #ffffff 66%, ${GREEN} 66%, ${GREEN} 100%)`,
          }}
        />
        <motion.div
          className="absolute -top-16 -right-10 w-52 h-52 rounded-full blur-3xl"
          style={{ background: `${SAFFRON}33` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full blur-3xl"
          style={{ background: `${GREEN}33` }}
          animate={{ opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
            15 August 2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            <span style={{ color: SAFFRON }}>Happy Independence </span>
            <span style={{ color: GREEN }}>Day 🇮🇳</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            To every aspirant chasing their dream — salute the freedom fighters, and keep fighting
            for your own goal. <span className="font-semibold text-foreground">Jai Hind!</span>
          </p>
          <p className="mt-3 text-xs font-bold text-foreground">— Team PrepPro Network</p>
        </div>
      </motion.div>
    </section>
  );
};

export default IndependenceDayBanner;