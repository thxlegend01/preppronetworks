import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingSupportButton = () => {
  return (
    <a
      href="https://gplinks.co/wtGQu"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 animate-bounce-slow"
    >
      <Button
        size="lg"
        className="rounded-full bg-gradient-to-r from-success to-emerald-500 hover:from-success/90 hover:to-emerald-500/90 shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/40 transition-all duration-300 hover:scale-110 active:scale-95 px-6"
      >
        <ExternalLink className="w-5 h-5 mr-2" />
        Code & Support
      </Button>
    </a>
  );
};

export default FloatingSupportButton;
