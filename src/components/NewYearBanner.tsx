import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NewYearBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-2">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <span className="flex items-center gap-2 text-xs font-semibold">
              🚀 Powered by PrepPro Network
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold">
              🎯 Your Trusted Study Partner
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold">
              📚 All Study Portals — One Network
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold">
              🔥 JEE · NEET · Boards — Free Access
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold">
              ✨ PW · Vibrant · Next Toppers · Mission JEET
            </span>
          </div>
        ))}
      </motion.div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 z-10"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default NewYearBanner;
