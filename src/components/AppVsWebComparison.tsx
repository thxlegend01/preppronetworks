import { motion } from "framer-motion";
import { Check, X, Download, Smartphone, Globe, Zap, Wifi, WifiOff, Bell, Shield, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  { feature: "Offline Access", app: true, web: false, icon: WifiOff },
  { feature: "Push Notifications", app: true, web: false, icon: Bell },
  { feature: "Faster Loading", app: true, web: false, icon: Gauge },
  { feature: "Smooth Performance", app: true, web: false, icon: Zap },
  { feature: "Auto Updates", app: true, web: true, icon: Shield },
  { feature: "No Installation Needed", app: false, web: true, icon: Globe },
  { feature: "Cross-Platform Access", app: false, web: true, icon: Globe },
  { feature: "Always Latest Version", app: false, web: true, icon: Shield },
  { feature: "Home Screen Access", app: true, web: false, icon: Smartphone },
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

  const appWins = comparisonData.filter((d) => d.app && !d.web).length;
  const webWins = comparisonData.filter((d) => d.web && !d.app).length;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-foreground">App</span>{" "}
            <span className="text-muted-foreground">vs</span>{" "}
            <span className="text-foreground">Web</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            See why the PrepPro Network App gives you the best experience
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="max-w-2xl mx-auto glass-card rounded-2xl border border-border/50 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="grid grid-cols-3 gap-0 border-b border-border/50">
            <div className="p-4 font-semibold text-sm text-muted-foreground">Feature</div>
            <div className="p-4 text-center font-bold text-primary bg-primary/10 border-x border-border/30">
              <Smartphone className="w-5 h-5 mx-auto mb-1" />
              App 🏆
            </div>
            <div className="p-4 text-center font-semibold text-muted-foreground">
              <Globe className="w-5 h-5 mx-auto mb-1" />
              Web
            </div>
          </div>

          {/* Rows */}
          {comparisonData.map((row, i) => (
            <motion.div
              key={row.feature}
              className="grid grid-cols-3 gap-0 border-b border-border/30 last:border-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="p-3 flex items-center gap-2 text-sm text-foreground">
                <row.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{row.feature}</span>
              </div>
              <div className="p-3 flex items-center justify-center bg-primary/5 border-x border-border/30">
                {row.app ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div className="p-3 flex items-center justify-center">
                {row.web ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </div>
            </motion.div>
          ))}

          {/* Score */}
          <div className="grid grid-cols-3 gap-0 bg-primary/10 border-t border-border/50">
            <div className="p-4 font-bold text-sm text-foreground">Score</div>
            <div className="p-4 text-center font-black text-xl text-primary border-x border-border/30">
              {appWins} ✅
            </div>
            <div className="p-4 text-center font-bold text-lg text-muted-foreground">
              {webWins}
            </div>
          </div>
        </motion.div>

        {/* Winner Banner */}
        <motion.div
          className="max-w-2xl mx-auto mt-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/15 border border-primary/30 rounded-full mb-6">
            <span className="text-2xl">🏆</span>
            <span className="font-bold text-primary">App Wins! Get the best experience</span>
          </div>

          <div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="hero"
                size="lg"
                onClick={handleDownload}
                className="px-8 py-6 text-lg relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                />
                <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                Download PrepPro App Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppVsWebComparison;
