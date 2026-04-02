import { ArrowDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-background" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.08] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/8 border border-primary/15 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">India's Study Hub</span>
          </motion.div>

          {/* Logo placeholder - animated */}
          <motion.div
            variants={item}
            className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20"
          >
            <motion.span
              className="text-primary-foreground font-black text-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              P
            </motion.span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-[1.05] tracking-tight">
            <span className="text-foreground">All Study Portals</span>
            <br />
            <span className="text-gradient">One Network</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={item} className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            PW · Vibrant Academy · Next Toppers · Mission JEET — Access everything from PrepPro Network.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={item}>
            <Button
              size="lg"
              className="h-14 px-10 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
              onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
            >
              <ArrowDown className="w-5 h-5 mr-2" />
              Explore Portals
            </Button>
          </motion.div>

          {/* Quick Links pills */}
          <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-2">
            {["Apps", "Tests", "Material", "Tracker", "Chat"].map((label) => (
              <span key={label} className="px-4 py-1.5 text-xs font-medium rounded-full bg-card border border-border/60 text-muted-foreground">
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
