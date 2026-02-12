import { Github, Youtube, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const quickLinks = [
  { label: "Premium Apps", href: "/apps" },
  { label: "Test Series", href: "/test-series" },
  { label: "Study Material", href: "/study-material" },
  { label: "Study Tracker", href: "/study-tracker" },
  { label: "About Developer", href: "/#developer" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

const Footer = () => {
  return (
    <footer id="about" className="border-t border-border/40 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={prepproLogo} 
                alt="PrepPro Network" 
                className="w-10 h-10 rounded-xl ring-2 ring-primary/30"
              />
              <div>
                <div className="font-bold text-lg text-gradient">PrepPro Network</div>
                <div className="text-xs text-muted-foreground">Prep like a Pro</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your one-stop platform for JEE, NEET & competitive exam preparation.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-5 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrepPro Network. Made with ❤️ for aspirants.
          </p>
          
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-secondary/50 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
