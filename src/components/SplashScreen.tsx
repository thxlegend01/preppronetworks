import { useState, useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"show" | "fade">("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 1600);
    const completeTimer = setTimeout(() => onComplete(), 2200);
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
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-extrabold text-2xl">P</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground">PrepPro</h1>
          <p className="text-xs text-muted-foreground mt-1">Prep like a Pro</p>
        </div>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
