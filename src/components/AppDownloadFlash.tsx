import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppDownloadFlash = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("app-flash-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("app-flash-dismissed", "true");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/PrepPro-Network.apk";
    link.download = "PrepPro-Network.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-sm glass-card rounded-3xl border border-primary/30 p-8 text-center overflow-hidden"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Flash glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                    "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors z-10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30"
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.2)",
                    "0 0 40px hsl(var(--primary) / 0.5)",
                    "0 0 20px hsl(var(--primary) / 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Smartphone className="w-10 h-10 text-primary" />
              </motion.div>

              <h3 className="text-2xl font-black mb-2 text-foreground">
                Get the App! 📱
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Download PrepPro Network App for the best mobile experience
              </p>

              {/* Features */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { icon: Zap, label: "Fast" },
                  { icon: Star, label: "Premium" },
                  { icon: Download, label: "Offline" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <f.icon className="w-3 h-3 text-primary" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleDownload}
                  className="w-full py-5 text-base relative overflow-hidden group"
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
                  Download Now
                </Button>
              </motion.div>

              {/* Cancel */}
              <button
                onClick={handleDismiss}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Not now, maybe later
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppDownloadFlash;
