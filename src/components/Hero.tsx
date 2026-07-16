import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Subtle ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,hsl(328_88%_52%/0.08),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/10 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
            <span className="text-[11px] font-semibold tracking-wide text-foreground/70 uppercase">India's #1 Study Network</span>
          </motion.div>

          {/* Hero headline — the centerpiece */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] font-black leading-[0.95] tracking-[-0.035em] mb-8"
          >
            <span className="block text-foreground">Prep Like a Pro</span>
            <span className="block text-gradient">With PrepPro</span>
          </motion.h1>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="h-14 px-9 text-base font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-[0_10px_30px_-10px_hsl(var(--foreground)/0.45)] hover:shadow-[0_18px_40px_-12px_hsl(var(--foreground)/0.55)] hover:-translate-y-0.5 transition-all duration-300 group"
              onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
