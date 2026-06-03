import { useState, useEffect } from "react";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Lean 1.3s splash: logo zooms in, soft halo bloom, sweep highlight, fade out.
 * No bouncy/playful motion — clean and brand-forward.
 */
const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 1350);
    return () => clearTimeout(t);
  }, [onComplete]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center splash-root" aria-hidden="true">
      <div className="splash-halo" />
      <div className="splash-wrap">
        <img
          src={prepproLogo}
          alt=""
          width={96}
          height={96}
          className="splash-logo"
          style={{ width: 96, height: 96 }}
        />
        <div className="splash-shine" />
      </div>
      <div className="splash-wordmark">
        <span className="splash-dot" />
        PrepPro Network
      </div>
      <style>{`
        .splash-root {
          background: radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 60%, hsl(var(--background) / 0.96) 100%);
          animation: splashFade 0.3s ease-in 1.05s forwards;
          will-change: opacity;
          flex-direction: column;
          gap: 18px;
        }
        .splash-halo {
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 9999px;
          background: radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%);
          filter: blur(28px);
          opacity: 0;
          animation: haloIn 1.1s ease-out forwards;
        }
        .splash-wrap {
          position: relative;
          width: 96px; height: 96px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 18px 48px -12px hsl(var(--primary) / 0.55), 0 0 0 1px hsl(var(--primary) / 0.25);
          opacity: 0;
          transform: scale(0.86);
          animation: logoIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .splash-logo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .splash-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
          transform: translateX(-120%);
          animation: shineSweep 0.7s ease-out 0.35s forwards;
        }
        .splash-wordmark {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          font-size: 1.1rem;
          color: hsl(var(--foreground));
          opacity: 0;
          animation: wordIn 0.45s ease-out 0.45s forwards;
        }
        .splash-dot {
          width: 6px; height: 6px; border-radius: 9999px;
          background: hsl(var(--primary));
          box-shadow: 0 0 12px hsl(var(--primary));
        }
        @keyframes logoIn {
          0% { opacity: 0; transform: scale(0.86); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes haloIn {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes shineSweep {
          to { transform: translateX(120%); }
        }
        @keyframes wordIn {
          to { opacity: 1; }
        }
        @keyframes splashFade {
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
