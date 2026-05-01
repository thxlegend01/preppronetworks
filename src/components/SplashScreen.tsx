import { useState, useEffect } from "react";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center splash-root"
      aria-hidden="true"
    >
      <img
        src={prepproLogo}
        alt=""
        width={88}
        height={88}
        className="splash-logo w-22 h-22 rounded-2xl shadow-xl"
        style={{ width: 88, height: 88 }}
      />
      <style>{`
        .splash-root {
          background: hsl(var(--background));
          animation: splashFade 0.45s ease-in 1.55s forwards;
          will-change: opacity;
        }
        .splash-logo {
          opacity: 0;
          animation: logoIn 0.55s ease-out forwards;
          will-change: opacity, transform;
        }
        @keyframes logoIn {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFade {
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
