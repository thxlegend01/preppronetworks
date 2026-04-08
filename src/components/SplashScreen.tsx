import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-700 ${
        phase === "fade" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background effects */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[150px]"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo with dramatic entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -270, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10, duration: 1.2 }}
        >
          <motion.div
            className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 relative"
            animate={{
              boxShadow: [
                "0 0 20px hsl(340 80% 65% / 0.2)",
                "0 0 50px hsl(340 80% 65% / 0.4)",
                "0 0 20px hsl(340 80% 65% / 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Text with staggered entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-3xl font-black text-foreground tracking-tight">PrepPro</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground mt-1.5"
          >
            Prep like a Pro
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-2 mt-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
