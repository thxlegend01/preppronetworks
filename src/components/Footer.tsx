import { Heart, ExternalLink } from "lucide-react";
import prepproLogo from "@/assets/preppro-logo.jpg";

const Footer = () => {
  return (
    <>
      {/* Main footer content - scrollable part */}
      <footer className="relative border-t border-border/20 bg-card/30 pb-24 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/20">
                  <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">PrepPro Network</h3>
                  <p className="text-[10px] text-muted-foreground">Prep Like a Pro With PrepPro</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-[300px] leading-relaxed">
                All premium study portals, test series & resources — completely free for every aspirant.
              </p>
            </div>

            <a
              href="https://prepproportals.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:shadow-lg hover:shadow-primary/10 hover:bg-primary/15 transition-all duration-300"
            >
              Explore PrepPro Network
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="mt-8 pt-5 border-t border-border/20">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                © {new Date().getFullYear()} PrepPro Network. Made with
                <Heart className="w-3 h-3 text-primary fill-primary" />
                for aspirants.
              </p>
              <p className="text-[10px] text-muted-foreground/50">
                Powered by PrepPro Network
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Permanent sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/90 backdrop-blur-xl border-t border-border/30 px-4 py-2.5">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <a href="/" className="flex flex-col items-center gap-0.5 text-primary no-link-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span className="text-[10px] font-medium">Home</span>
            </a>
            <a href="/apps" className="flex flex-col items-center gap-0.5 text-muted-foreground no-link-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              <span className="text-[10px] font-medium">Apps</span>
            </a>
            <a href="/test-series" className="flex flex-col items-center gap-0.5 text-muted-foreground no-link-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="text-[10px] font-medium">Tests</span>
            </a>
            <a href="/study-material" className="flex flex-col items-center gap-0.5 text-muted-foreground no-link-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span className="text-[10px] font-medium">Material</span>
            </a>
            <a href="/study-tracker" className="flex flex-col items-center gap-0.5 text-muted-foreground no-link-style">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              <span className="text-[10px] font-medium">Tracker</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
