import { useState, useEffect } from "react";
import { X, BookOpen, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const quotes = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
];

const NewYearBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2.5 flex-wrap text-center pr-8">
          <img src={prepproLogo} alt="PrepPro" className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30 hidden sm:block" />
          <Flame className="w-4 h-4 text-orange-300 animate-pulse" />
          <span className="text-xs md:text-sm font-medium italic">
            "{quote.text}"
          </span>
          <span className="text-[10px] md:text-xs opacity-75">
            — {quote.author}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-primary-foreground hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

export default NewYearBanner;
