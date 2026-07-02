import { Heart, ArrowRight, Instagram, Youtube, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import prepproLogo from "@/assets/preppro-logo.jpg";

const resourceLinks = [
  { label: "Study Apps", to: "/apps" },
  { label: "Test Series", to: "/test-series" },
  { label: "Study Material", to: "/study-material" },
  { label: "Study Tracker", to: "/study-tracker" },
  { label: "PrepChat", to: "/prepchat" },
];

const companyLinks = [
  { label: "About", to: "/#about" },
  { label: "Community", to: "/community" },
  { label: "Announcements", to: "/announcements" },
  { label: "Profile", to: "/profile" },
];

const Footer = () => {
  return (
    <footer className="relative bg-[hsl(350_60%_97%)] border-t border-primary/20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 py-14 relative">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/30">
                <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-display text-base font-extrabold text-foreground">PrepPro Network</h3>
                <p className="text-[10px] text-muted-foreground">Prep Like a Pro</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5 max-w-xs">
              India's calm, curated home for JEE, NEET, NDA & CDS aspirants — every batch, test and tool in one premium place.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: MessageCircle, href: "https://whatsapp.com/channel/0029Vb7Q3lrF1YlUHIHepd3V" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-primary/30 flex items-center justify-center text-foreground/70 hover:text-accent hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-500"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="underline-grow inline-block text-sm text-muted-foreground hover:text-foreground transition-colors no-link-style">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="underline-grow inline-block text-sm text-muted-foreground hover:text-foreground transition-colors no-link-style">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">Stay in the loop</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              New batches, test drops and study drops — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center bg-white border border-primary/30 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-all"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            © {new Date().getFullYear()} PrepPro Network. Crafted with
            <Heart className="w-3 h-3 text-accent fill-accent animate-pulse" />
            for Students.
          </p>
          <div className="flex items-center gap-5 text-[11px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="https://prepproportals.lovable.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              PrepPro Portals <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
