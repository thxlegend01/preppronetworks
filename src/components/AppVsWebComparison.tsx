import { motion } from "framer-motion";
import { Check, X, Download, Smartphone, Globe, Zap, Wifi, WifiOff, Bell, Shield, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  { feature: "Offline Access", app: true, web: false, icon: WifiOff },
  { feature: "Push Notifications", app: true, web: false, icon: Bell },
  { feature: "Faster Loading", app: true, web: false, icon: Gauge },
  { feature: "Smooth Performance", app: true, web: false, icon: Zap },
  { feature: "Auto Updates", app: true, web: true, icon: Shield },
  { feature: "No Install Needed", app: false, web: true, icon: Globe },
  { feature: "Cross-Platform", app: false, web: true, icon: Globe },
  { feature: "Native Experience", app: true, web: false, icon: Smartphone },
];

const AppVsWebComparison = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/PrepPro-Network.apk";
    link.download = "PrepPro-Network.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">
            App <span className="text-muted-foreground font-normal">vs</span> Web
          </h2>
          <p className="text-sm text-muted-foreground">See why the app gives you the best experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto rounded-2xl bg-card border border-border/60 overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border/40">
            <div className="p-3 text-xs font-medium text-muted-foreground">Feature</div>
            <div className="p-3 text-center text-xs font-bold text-primary bg-primary/5 border-x border-border/30">
              App 📱
            </div>
            <div className="p-3 text-center text-xs font-medium text-muted-foreground">Web</div>
          </div>

          {comparisonData.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-b border-border/20 last:border-0">
              <div className="p-2.5 flex items-center gap-2 text-xs text-foreground">
                <row.icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{row.feature}</span>
              </div>
              <div className="p-2.5 flex items-center justify-center bg-primary/[0.03] border-x border-border/20">
                {row.app ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
              </div>
              <div className="p-2.5 flex items-center justify-center">
                {row.web ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <Button className="rounded-xl bg-primary text-primary-foreground px-6" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download App
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AppVsWebComparison;
