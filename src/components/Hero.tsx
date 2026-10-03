import { ArrowRight, Sparkles, BookOpen, ClipboardCheck, Timer, MessageCircle, Play, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import pwLogo from "@/assets/pw-logo-new.jpg";

const quick = [
  { to: "/apps", label: "Study Apps", icon: Play },
  { to: "/test-series", label: "Test Series", icon: ClipboardCheck },
  { to: "/study-material", label: "Material", icon: BookOpen },
  { to: "/study-tracker", label: "Tracker", icon: Timer },
  { to: "/prepchat", label: "PrepChat", icon: MessageCircle },
];

const stats = [
  { v: "40+", l: "Resources" },
  { v: "100%", l: "Free" },
  { v: "24/7", l: "Access" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const Hero = () => {
  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] radial-glow" />
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left: message */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold tracking-wider text-foreground/75 uppercase">New PrepPro · Relaunched</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="text-[42px] sm:text-6xl lg:text-[76px] font-black leading-[0.95] tracking-[-0.035em] mb-5"
            >
              <span className="block text-foreground">Prep Like a Pro</span>
              <span className="block text-gradient">With PrepPro</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Every top JEE &amp; NEET batch, test series and study material — one fast, free, beautiful home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all duration-300 group"
                onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold rounded-full glass-card">
                <Link to="/pw" className="no-link-style">Open PW App</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center lg:justify-start gap-8"
            >
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-black text-foreground">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: promotion area */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] pink-glow opacity-70" />
            <Link to="/pw" className="no-link-style block relative rounded-[1.75rem] glass-card p-6 md:p-7 overflow-hidden group card-hover">
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="flex items-center justify-between mb-6 relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-primary/15 text-primary">Featured</span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><ShieldCheck className="w-3.5 h-3.5" /> Official PrepPro</span>
              </div>
              <div className="flex items-center gap-4 mb-5 relative">
                <img src={pwLogo} alt="PrepPro Physics Wallah" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">PrepPro × Physics Wallah</h2>
                  <p className="text-sm text-muted-foreground">Live classes, batches, notes &amp; DPPs</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6 relative">
                {["Live", "Batches", "DPPs"].map((t) => (
                  <div key={t} className="rounded-xl bg-foreground/[0.04] border border-border/50 py-2.5 text-center text-xs font-semibold text-foreground/80">{t}</div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-foreground text-background px-5 py-3.5 relative">
                <span className="font-semibold">Launch now — free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Quick access dock */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex gap-2.5 overflow-x-auto justify-start md:justify-center pb-1"
        >
          {quick.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="no-link-style shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full glass-card text-sm font-medium text-foreground/85 hover:text-primary hover-scale">
              <Icon className="w-4 h-4 text-primary" /> {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
