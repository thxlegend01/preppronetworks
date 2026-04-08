import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import prepproLogo from "@/assets/preppro-logo.jpg";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-card/30 pb-20 md:pb-0 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/20"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h3 className="text-sm font-bold text-foreground">PrepPro Network</h3>
                <p className="text-[10px] text-muted-foreground">Prep Like a Pro With PrepPro</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-[300px] leading-relaxed">
              All premium study portals, test series & resources — completely free for every aspirant.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            href="https://prepproportals.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:shadow-lg hover:shadow-primary/10 hover:bg-primary/15 transition-all duration-300"
          >
            PrepPro Network Portal
            <ExternalLink className="w-3 h-3" />
          </motion.a>
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
  );
};

export default Footer;
