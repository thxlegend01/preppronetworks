import { ArrowRight, Sparkles, BookOpen, Trophy, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "50K+", label: "Aspirants" },
  { value: "40+", label: "Resources" },
  { value: "12+", label: "Test Series" },
];

const Hero = () => {
  return (
    <section className="ambient-glow relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <div className="container mx-auto px-5 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT — editorial headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur border border-primary/30 mb-7 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-semibold tracking-wide text-foreground/70 uppercase">India's #1 Study Network</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-[44px] sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold leading-[0.95] tracking-[-0.035em] mb-6 text-foreground"
            >
              Unlocking Your{" "}
              <span className="text-gradient italic font-black">Academic</span>{" "}
              Network
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-9"
            >
              A calm, premium home for JEE, NEET, NDA & CDS aspirants — every batch, test series, and study tool you actually need, curated in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <Button
                size="lg"
                className="shimmer-btn h-14 px-8 text-sm font-bold rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_14px_40px_-10px_hsl(351_100%_72%/0.55)] hover:shadow-[0_20px_50px_-10px_hsl(351_100%_72%/0.7)] hover:-translate-y-0.5 transition-all duration-500 group"
                onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-14 px-6 text-sm font-semibold rounded-full text-foreground/80 hover:bg-white/60 hover:backdrop-blur"
                onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Resources
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-md"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display text-3xl md:text-4xl font-extrabold text-gradient leading-none">{s.value}</span>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1.5">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating glass cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative h-[420px] hidden lg:block"
          >
            {/* Main card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="luxe-card absolute top-6 left-4 w-[280px] p-6"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center mb-4 border border-white/60">
                <BookOpen className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-1">Curated Batches</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">PW, Allen, Unacademy & more — all handpicked.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">Premium</span>
                <ArrowRight className="w-4 h-4 text-foreground/60" />
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="luxe-card absolute top-2 right-0 w-[220px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/40 to-primary/30 flex items-center justify-center border border-white/60">
                  <Trophy className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-semibold text-accent">LIVE</span>
              </div>
              <div className="font-display text-3xl font-extrabold text-gradient leading-none">#1</div>
              <p className="text-xs text-muted-foreground mt-1">Study Tracker Rank</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="luxe-card absolute bottom-4 left-16 w-[260px] p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center border border-white/60">
                  <Timer className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-foreground">Today's Focus</div>
                  <div className="text-[10px] text-muted-foreground">4h 32m tracked</div>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-primary/15 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
