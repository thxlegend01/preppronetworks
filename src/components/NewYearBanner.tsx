import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative bg-primary text-primary-foreground py-2 px-4">
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 text-center pr-8">
          <span className="text-xs font-medium italic line-clamp-1">
            "{quote.text}" — {quote.author}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default NewYearBanner;
