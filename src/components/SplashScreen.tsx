import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(fadeTimer); clearTimeout(completeTimer); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-700 ${
        phase === "fade" ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Radial pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/10"
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{ width: [80, 400 + i * 100], height: [80, 400 + i * 100], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, delay: 0.3 + i * 0.4, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Background glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(340 75% 62% / 0.15), transparent 70%)" }}
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="flex flex-col items-center gap-5 relative z-10">
        {/* Logo with cinematic entrance */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30 relative"
            animate={{
              boxShadow: [
                "0 0 15px hsl(340 75% 62% / 0.2)",
                "0 0 40px hsl(340 75% 62% / 0.4)",
                "0 0 15px hsl(340 75% 62% / 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={prepproLogo} alt="PrepPro" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-2xl font-black text-foreground tracking-tight">PrepPro Network</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-muted-foreground mt-1"
          >
            Prep Like a Pro
          </motion.p>
        </motion.div>

        {/* Animated line */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
