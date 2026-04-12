import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 2800);
    const completeTimer = setTimeout(() => onComplete(), 3400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-600 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(145deg, #030712 0%, #0c1029 50%, #120a28 100%)",
      }}
    >
      {/* Soft radial glow behind logo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, hsl(340 75% 55% / 0.15), hsl(260 50% 40% / 0.08), transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-5 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 40px hsl(340 75% 55% / 0.25), 0 0 80px hsl(340 75% 55% / 0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl font-bold tracking-tight text-white/90"
        >
          PrepPro Network
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-xs text-white/40 text-center max-w-[240px]"
        >
          Empowering JEE, NEET & Competitive Aspirants
        </motion.p>

        {/* Minimal loading bar */}
        <motion.div
          className="mt-4 h-[2px] rounded-full overflow-hidden bg-white/5"
          style={{ width: 120 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(340 75% 55%), hsl(260 60% 55%))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.1, duration: 1.8, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
