import { useState, useEffect } from "react";
import logo from "@/assets/preppro-network-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'expand' | 'fade'>('logo');

  useEffect(() => {
    // Logo animation phase
    const expandTimer = setTimeout(() => setPhase('expand'), 1500);
    // Fade out phase
    const fadeTimer = setTimeout(() => setPhase('fade'), 2500);
    // Complete
    const completeTimer = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === 'fade' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Animated glow effects */}
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-1000 ${
          phase === 'expand' ? 'scale-150 opacity-40' : 'scale-100 opacity-20'
        }`}
        style={{ background: 'hsl(var(--primary))' }}
      />
      
      {/* Radial rings */}
      <div className={`absolute transition-all duration-1000 ${phase === 'expand' ? 'scale-[3] opacity-0' : 'scale-100 opacity-30'}`}>
        <div className="w-[300px] h-[300px] rounded-full border border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
      </div>
      <div className={`absolute transition-all duration-1000 delay-100 ${phase === 'expand' ? 'scale-[3] opacity-0' : 'scale-100 opacity-20'}`}>
        <div className="w-[400px] h-[400px] rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '2.5s' }} />
      </div>
      
      {/* Main logo container */}
      <div className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-700 ${
        phase === 'logo' ? 'scale-100' : phase === 'expand' ? 'scale-110' : 'scale-95'
      }`}>
        {/* Logo with effects */}
        <div className={`relative transition-all duration-500 ${phase === 'expand' ? 'scale-110' : 'scale-100'}`}>
          {/* Logo glow backdrop */}
          <div 
            className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-700 ${
              phase === 'logo' ? 'opacity-60' : 'opacity-100'
            }`}
            style={{ background: 'hsl(var(--primary))', transform: 'scale(1.2)' }}
          />
          
          {/* Logo image */}
          <img 
            src={logo} 
            alt="PrepPro Network" 
            className={`relative w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl object-cover transition-all duration-500 ${
              phase === 'expand' ? 'rotate-[360deg]' : 'rotate-0'
            }`}
            style={{ 
              boxShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 0 120px hsl(var(--primary) / 0.3)'
            }}
          />
          
          {/* Sparkle particles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Brand text */}
        <div className={`text-center transition-all duration-700 delay-200 ${
          phase === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight">
            PrepPro Network
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2 font-medium">
            Prep like a Pro
          </p>
        </div>

        {/* Loading indicator */}
        <div className={`flex gap-2 mt-4 transition-opacity duration-500 ${
          phase === 'fade' ? 'opacity-0' : 'opacity-100'
        }`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30 rounded-tr-xl" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30 rounded-bl-xl" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-xl" />
    </div>
  );
};

export default SplashScreen;
