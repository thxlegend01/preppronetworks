import { ArrowLeft, ArrowUpRight, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InfinityTelegramStrip = ({ batches }: { batches: boolean }) => (
  <header aria-label="PrepPro Telegram channel" className={`absolute inset-x-0 top-0 z-20 flex items-center gap-2 border-b border-primary/30 bg-background px-3 sm:gap-5 sm:px-6 ${batches ? "h-[60px] md:h-[76px]" : "h-[71px]"}`}>
    <Button asChild variant="ghost" size="icon" className="shrink-0" title="Back to PrepPro Infinity">
      <Link to="/PrepInfinity" aria-label="Back to PrepPro Infinity"><ArrowLeft className="h-5 w-5" /></Link>
    </Button>
    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary sm:flex">
      <Send className="h-6 w-6" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-black leading-snug text-foreground sm:text-lg">PrepPro Network</p>
      <p className="text-xs leading-snug text-muted-foreground sm:text-sm">Join our Telegram channel</p>
    </div>
    <Button asChild className="btn-click-effect shrink-0 gap-1.5 font-bold">
      <a href="https://t.me/+Vaaty3NWsRIzOThl" target="_blank" rel="noopener noreferrer">Join <ArrowUpRight className="h-4 w-4" /></a>
    </Button>
  </header>
);

export default InfinityTelegramStrip;