import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Apps", href: "/apps" },
  { label: "Tests", href: "/test-series" },
  { label: "Material", href: "/study-material" },
  { label: "Tracker", href: "/study-tracker" },
  { label: "Chat", href: "/prepchat" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/30 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">P</span>
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">PrepPro Network</span>
              <span className="text-xs text-muted-foreground ml-2">Prep like a Pro</span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4">
            {quickLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PrepPro Network. Made with ❤️ for aspirants.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
