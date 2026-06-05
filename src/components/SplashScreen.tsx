import { useState, useEffect } from "react";
import prepproLogo from "@/assets/preppro-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Cinematic 2.2s splash: logo zooms in with halo bloom, ring trace, sweep,
 * progress bar, wordmark + tagline. Logo is statically imported so it is
 * available offline / on slow networks — no spinner fallback shown.
 */
const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 2200);
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
          width={104}
          height={104}
          className="splash-logo"
          style={{ width: 104, height: 104 }}
        />
        <div className="splash-shine" />
      </div>
      <div className="splash-wordmark">
        <span className="splash-dot" />
        PrepPro Network
      </div>
      <div className="splash-tagline">Prep like a Pro</div>
      <div className="splash-progress"><span /></div>
      <style>{`
        .splash-root {
          background: radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 60%, hsl(var(--background) / 0.96) 100%);
          animation: splashFade 0.4s ease-in 1.8s forwards;
          will-change: opacity;
          flex-direction: column;
          gap: 16px;
        }
        .splash-halo {
          position: absolute;
          width: 280px; height: 280px;
          border-radius: 9999px;
          background: radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%);
          filter: blur(36px);
          opacity: 0;
          animation: haloIn 1.4s ease-out forwards, haloPulse 1.6s ease-in-out 0.6s infinite;
        }
        .splash-ring {
          position: absolute;
          width: 180px; height: 180px;
          opacity: 0;
          animation: ringIn 0.35s ease-out 0.15s forwards, ringSpin 2.4s linear 0.5s infinite;
        }
        .splash-ring-arc {
          stroke-dasharray: 88 264;
          stroke-dashoffset: 0;
          filter: drop-shadow(0 0 6px hsl(var(--primary) / 0.6));
          transform-origin: 60px 60px;
        }
        .splash-wrap {
          position: relative;
          width: 104px; height: 104px;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 22px 60px -12px hsl(var(--primary) / 0.6), 0 0 0 1px hsl(var(--primary) / 0.3);
          opacity: 0;
          transform: scale(0.7);
          animation: logoIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards, logoFloat 2.4s ease-in-out 0.8s infinite;
        }
        .splash-logo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .splash-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
          transform: translateX(-120%);
          animation: shineSweep 0.9s ease-out 0.5s forwards, shineSweep 0.9s ease-out 1.4s forwards;
        }
        .splash-wordmark {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.025em;
          font-size: 1.25rem;
          color: hsl(var(--foreground));
          opacity: 0;
          animation: wordIn 0.5s ease-out 0.7s forwards;
          margin-top: 8px;
        }
        .splash-tagline {
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-weight: 500;
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          opacity: 0;
          animation: wordIn 0.5s ease-out 0.95s forwards;
        }
        .splash-progress {
          width: 120px; height: 2px;
          background: hsl(var(--muted) / 0.4);
          border-radius: 9999px;
          overflow: hidden;
          opacity: 0;
          animation: wordIn 0.3s ease-out 1.1s forwards;
          margin-top: 6px;
        }
        .splash-progress span {
          display: block; height: 100%; width: 0%;
          background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent, var(--primary))));
          border-radius: inherit;
          animation: barFill 1s cubic-bezier(0.4, 0, 0.2, 1) 1.05s forwards;
        }
        .splash-dot {
          width: 7px; height: 7px; border-radius: 9999px;
          background: hsl(var(--primary));
          box-shadow: 0 0 14px hsl(var(--primary));
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        @keyframes logoIn {
          0% { opacity: 0; transform: scale(0.7) rotate(-6deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        @keyframes haloIn {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
        @keyframes ringIn { to { opacity: 1; } }
        @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barFill { to { width: 100%; } }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
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
