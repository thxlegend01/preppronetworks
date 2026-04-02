import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "Apps", href: "/apps" },
  { label: "Tests", href: "/test-series" },
  { label: "Material", href: "/study-material" },
  { label: "Tracker", href: "/study-tracker" },
  { label: "Chat", href: "/prepchat" },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 bg-card/50 pb-20 md:pb-0 overflow-hidden">
      {/* Subtle gradient top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-black text-sm">P</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">PrepPro Network</h3>
                <p className="text-[10px] text-muted-foreground">India's #1 Study Hub</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-left max-w-[250px] leading-relaxed">
              All premium study portals, test series & resources — completely free for every aspirant.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Portal link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-end gap-3"
          >
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Portal</h4>
            <a
              href="https://pwpreppro.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-xs font-semibold text-primary hover:shadow-md hover:shadow-primary/10 transition-all duration-300"
            >
              PrepPro Network Portal
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              © {new Date().getFullYear()} PrepPro Network. Made with
              <Heart className="w-3 h-3 text-primary fill-primary" />
              for aspirants.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Powered by PrepPro Network
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
