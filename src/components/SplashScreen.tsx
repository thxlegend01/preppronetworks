import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 1800);
    const completeTimer = setTimeout(() => onComplete(), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
          className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 border-4 border-primary/20"
        >
          <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold text-foreground">PrepPro</h1>
          <p className="text-xs text-muted-foreground mt-1">Prep like a Pro</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-1.5 mt-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
