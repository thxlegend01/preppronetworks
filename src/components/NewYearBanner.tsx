import { useState } from "react";
import { X, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewYearBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-3 px-4">
      {/* Animated sparkles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center gap-3 flex-wrap text-center">
          <PartyPopper className="w-5 h-5 animate-bounce" />
          <span className="font-bold text-sm md:text-base">
            🎊 Happy New Year 2026! 🎊
          </span>
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm opacity-90 hidden sm:inline">
            PrepPro Network wishes you success in achieving all your goals!
          </span>
          <span className="text-sm opacity-90 sm:hidden">
            Wishing you success! 🚀
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-primary-foreground hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default NewYearBanner;
