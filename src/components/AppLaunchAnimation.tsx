import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface AppLaunchAnimationProps {
  open: boolean;
  logo?: string;
  title: string;
  accent?: string;
  onComplete: () => void;
  durationMs?: number;
}

/**
 * 3D app-launch overlay: pulls a logo card from the tap point, flips it in 3D space,
 * then expands into the next view. Pure presentational, ~1.2s total.
 */
const AppLaunchAnimation = ({
  open,
  logo,
  title,
  accent = "from-primary to-accent",
  onComplete,
  durationMs = 1100,
}: AppLaunchAnimationProps) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onComplete, durationMs);
    return () => clearTimeout(t);
  }, [open, onComplete, durationMs]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="launch"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ perspective: 1400 }}
        >
          {/* Radial accent halo */}
          <motion.div
            className={`absolute w-[420px] h-[420px] rounded-full bg-gradient-to-br ${accent} opacity-30 blur-3xl`}
            initial={{ scale: 0.2 }}
            animate={{ scale: [0.2, 1.4, 1.1], opacity: [0.0, 0.45, 0.0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />

          {/* Orbit rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/40"
              style={{ width: 180 + i * 80, height: 180 + i * 80 }}
              initial={{ opacity: 0, rotateX: 70, scale: 0.6 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.1, 1.3], rotate: 360 }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: "easeOut" }}
            />
          ))}

          {/* 3D logo card */}
          <motion.div
            className={`relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/40 bg-gradient-to-br ${accent}`}
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: -120, rotateX: 20, scale: 0.4, opacity: 0 }}
            animate={{
              rotateY: [-120, 0, 0, 30],
              rotateX: [20, 0, 0, -10],
              scale: [0.4, 1, 1.05, 2.4],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.1, times: [0, 0.45, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            {logo ? (
              <img src={logo} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">
                {title.charAt(0)}
              </div>
            )}
            {/* Specular highlight */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0"
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            className="absolute bottom-[28%] text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
            transition={{ duration: 1.1, times: [0, 0.45, 0.75, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-2">Launching</p>
            <p className="text-2xl font-black text-foreground">{title}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppLaunchAnimation;