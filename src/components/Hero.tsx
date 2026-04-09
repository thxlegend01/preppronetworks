import { ArrowDown, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import prepproLogo from "@/assets/preppro-logo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-12 overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-background" />
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.06] rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo with cinematic entrance */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
            className="mx-auto mb-10"
          >
            <motion.div
              className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden mx-auto shadow-2xl shadow-primary/30 border-2 border-primary/20 relative"
              animate={{ 
                boxShadow: [
                  "0 0 30px hsl(340 80% 65% / 0.2)",
                  "0 0 60px hsl(340 80% 65% / 0.4)",
                  "0 0 30px hsl(340 80% 65% / 0.2)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>

          {/* Heading with staggered reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">India's #1 Study Network</span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-[1.05] tracking-tight"
          >
            <span className="text-foreground">Prep Like a Pro</span>
            <br />
            <motion.span
              className="text-gradient"
              initial={{ backgroundSize: "0% 100%" }}
              animate={{ backgroundSize: "100% 100%" }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              With PrepPro
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          >
            PW · Vibrant Academy · Next Toppers · Mission JEET — Access everything from PrepPro Network.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="h-14 px-10 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-500 group"
              onClick={() => document.getElementById("apps")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Explore PrepPro Network
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {["Apps", "Tests", "Material", "Tracker", "Chat"].map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.08 }}
                className="px-4 py-1.5 text-xs font-medium rounded-full bg-card/50 border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-default backdrop-blur-sm"
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
      </motion.div>
    </section>
  );
};

export default Hero;
