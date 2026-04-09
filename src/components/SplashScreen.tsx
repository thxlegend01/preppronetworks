import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

// Floating particle component
const Particle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, hsl(340 80% 65% / 0.4), transparent)`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1.5, 0],
      y: [0, -60, -120],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  // Generate particles once
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        x: Math.random() * 100,
        y: 40 + Math.random() * 50,
        size: 3 + Math.random() * 5,
      })),
    []
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 3000);
    const completeTimer = setTimeout(() => onComplete(), 3600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        phase === "fade" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #000000 0%, #0a0f2c 40%, #1a0a2e 70%, #0d0d0d 100%)",
      }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
      ))}

      {/* Background glow orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          background: "radial-gradient(circle, hsl(340 80% 60% / 0.12), hsl(260 60% 40% / 0.06), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          background: "radial-gradient(circle, hsl(260 70% 50% / 0.15), transparent 70%)",
          filter: "blur(30px)",
        }}
        initial={{ x: -80, y: -60 }}
        animate={{ x: [-80, 80, -80], y: [-60, 40, -60], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo with scale-in + glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative w-24 h-24 rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 40px hsl(340 80% 60% / 0.3), 0 0 80px hsl(340 80% 60% / 0.15)",
            }}
            animate={{
              boxShadow: [
                "0 0 40px hsl(340 80% 60% / 0.3), 0 0 80px hsl(340 80% 60% / 0.15)",
                "0 0 60px hsl(340 80% 60% / 0.5), 0 0 120px hsl(340 80% 60% / 0.2)",
                "0 0 40px hsl(340 80% 60% / 0.3), 0 0 80px hsl(340 80% 60% / 0.15)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Glass border overlay */}
            <div
              className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
            <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-black tracking-tight"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          PrepPro Network
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="text-sm text-center max-w-[280px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Empowering JEE, NEET & Competitive Aspirants
        </motion.p>

        {/* Gradient line */}
        <motion.div
          className="h-[1.5px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(340 80% 60% / 0.6), hsl(260 60% 50% / 0.4), transparent)",
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 140, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />

        {/* Loading dots */}
        <motion.div
          className="flex gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "hsl(340 80% 65% / 0.6)" }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
