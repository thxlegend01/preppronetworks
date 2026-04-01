import { motion } from "framer-motion";
import { Download, Smartphone, Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppDownloadBannerProps {
  variant?: "top" | "bottom";
}

const AppDownloadBanner = ({ variant = "top" }: AppDownloadBannerProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/PrepPro-Network.apk";
    link.download = "PrepPro-Network.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isTop = variant === "top";

  if (isTop) {
    return (
      <section className="py-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">PrepPro App</p>
                <p className="text-[11px] text-muted-foreground">Download for Android</p>
              </div>
            </div>
            <Button size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs px-4" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              APK
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 md:p-8 rounded-2xl bg-card border border-border/60"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-7 h-7 text-primary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-1">PrepPro Android App</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get the full experience — offline access, push notifications & more.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {[
                  { icon: Star, label: "Premium Content" },
                  { icon: Shield, label: "100% Safe" },
                  { icon: Zap, label: "Fast & Smooth" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <f.icon className="w-3.5 h-3.5 text-primary" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="rounded-xl bg-primary text-primary-foreground px-6" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download APK
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>v1.0.0</span>
            <span>~15 MB</span>
            <span>Android 5.0+</span>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 p-6 rounded-2xl bg-card border border-border/60 text-center"
        >
          <p className="text-xs font-semibold text-primary mb-2">📢 Support PrepPro Network</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            We provide free JEE & NEET resources. Your one click supports our work to help thousands of students.
          </p>
          <Button
            className="rounded-xl bg-primary text-primary-foreground px-6"
            onClick={() => window.open("https://gplinks.co/UKMTht", "_blank")}
          >
            ❤️ Support Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownloadBanner;
