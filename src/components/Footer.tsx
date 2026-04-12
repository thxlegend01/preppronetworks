import { Heart, ExternalLink } from "lucide-react";
import prepproLogo from "@/assets/preppro-logo.jpg";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-card/30 pb-24 md:pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/20">
              <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">PrepPro Network</h3>
              <p className="text-[10px] text-muted-foreground">Prep Like a Pro</p>
            </div>
          </div>

          <a
            href="https://prepproportals.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/15 transition-all"
          >
            Explore PrepPro Network
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="pt-4 border-t border-border/20 w-full">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                © {new Date().getFullYear()} PrepPro Network. Made with
                <Heart className="w-3 h-3 text-primary fill-primary" />
                for aspirants.
              </p>
              <p className="text-[10px] text-muted-foreground/50">Powered by PrepPro Network</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
