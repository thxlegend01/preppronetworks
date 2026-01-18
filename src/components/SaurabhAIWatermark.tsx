import { Bot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SaurabhAIWatermark = () => {
  return (
    <motion.a
      href="https://prepprohub.lovable.app"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-4 left-4 z-50 group"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-60 blur-md transition-all duration-300" />
        
        {/* Main badge */}
        <div className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-pink-500/30 shadow-lg shadow-pink-500/10 group-hover:border-pink-500/50 transition-all duration-300">
          {/* AI Icon */}
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-pink-400 animate-pulse" />
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-tight">Powered by</span>
            <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Saurabh's AI
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default SaurabhAIWatermark;
