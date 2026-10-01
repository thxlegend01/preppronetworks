import { ArrowRight, BadgeCheck, BookOpen, ClipboardCheck, Smartphone, Timer } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const quick = [
  { to: "/apps", label: "Study Apps", sub: "PW, Allen & more", icon: Smartphone },
  { to: "/test-series", label: "Test Series", sub: "Mathongo, VOTS", icon: ClipboardCheck },
  { to: "/study-material", label: "Material", sub: "Notes & books", icon: BookOpen },
  { to: "/study-tracker", label: "Tracker", sub: "Focus timer", icon: Timer },
];

const Hero = () => {
  const reduce = useReducedMotion();
  const fade = (d = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: d },
  });

  return (
    <section className="pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="container mx-auto px-5 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
        <div>
          <motion.div {...fade()} className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-card mb-6">
            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">100% Free · JEE · NEET · NDA · CDS</span>
          </motion.div>
          <motion.h1 {...fade(0.05)} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
            Prep Like a Pro <span className="text-primary">With PrepPro Network</span>
          </motion.h1>
          <motion.p {...fade(0.1)} className="text-base md:text-lg text-muted-foreground max-w-xl mb-8">
            Every top study app, test series and resource in one organised place — completely free, forever.
          </motion.p>
          <motion.div {...fade(0.15)} className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" className="h-12 px-6 rounded-lg font-semibold group" onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Resources <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-lg font-semibold">
              <Link to="/pw">Open PrepPro PW</Link>
            </Button>
          </motion.div>
          <motion.div {...fade(0.2)} className="flex gap-6 text-sm">
            {[["40+", "Resources"], ["₹0", "Cost"], ["24/7", "Access"]].map(([n, l]) => (
              <div key={l}><div className="font-display font-bold text-xl text-foreground">{n}</div><div className="text-muted-foreground text-xs">{l}</div></div>
            ))}
          </motion.div>
        </div>
        <motion.div {...fade(0.15)} className="grid grid-cols-2 gap-3">
          {quick.map(({ to, label, sub, icon: Icon }) => (
            <Link key={to} to={to} className="no-link-style group rounded-xl border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
              <div className="font-display font-semibold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
