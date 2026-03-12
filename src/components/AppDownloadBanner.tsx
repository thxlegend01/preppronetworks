import { motion } from "framer-motion";
import { Download, Smartphone, Zap, Star, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedIcon3D from "./AnimatedIcon3D";
import Tilt3D from "./Tilt3D";

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

  return (
    <section className={`relative overflow-hidden ${isTop ? 'py-8' : 'py-16'}`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
      
      {/* Flash effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(90deg, transparent 0%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.2) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, transparent 100%)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <Tilt3D intensity={3} scale={1.01}>
          <motion.div
            className={`glass-card rounded-2xl ${isTop ? 'p-6' : 'p-8 md:p-12'} border border-primary/20 relative overflow-hidden`}
            initial={{ opacity: 0, y: isTop ? -30 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Shine sweep effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 55%, transparent 60%)",
                ],
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className={`flex flex-col ${isTop ? 'md:flex-row' : 'lg:flex-row'} items-center gap-6 ${isTop ? '' : 'md:gap-12'}`}>
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <motion.div
                  className={`${isTop ? 'w-16 h-16' : 'w-24 h-24'} rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 relative`}
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.2)",
                      "0 0 40px hsl(var(--primary) / 0.4)",
                      "0 0 20px hsl(var(--primary) / 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AnimatedIcon3D 
                    icon={Smartphone} 
                    size={isTop ? 32 : 48} 
                    animationType="float" 
                    className="text-primary"
                  />
                  
                  {/* Orbiting sparkle */}
                  <motion.div
                    className="absolute"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ width: isTop ? 60 : 90, height: isTop ? 60 : 90 }}
                  >
                    <Sparkles className={`absolute -top-1 left-1/2 -translate-x-1/2 ${isTop ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <div className={`flex-1 text-center ${isTop ? 'md:text-left' : 'lg:text-left'}`}>
                <motion.div 
                  className="flex items-center justify-center md:justify-start gap-2 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedIcon3D icon={Zap} size={16} animationType="pulse" className="text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Official Android App
                  </span>
                </motion.div>

                <h3 className={`${isTop ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'} font-black mb-2`}>
                  <span className="text-foreground">PrepPro Network</span>{" "}
                  <span className="text-gradient">Android App</span>
                </h3>

                {!isTop && (
                  <p className="text-muted-foreground mb-4 max-w-xl">
                    Get the full PrepPro experience on your Android device. Access all courses, 
                    tests, and study materials on the go!
                  </p>
                )}

                {/* Features */}
                <div className={`flex flex-wrap items-center justify-center ${isTop ? 'md:justify-start' : 'lg:justify-start'} gap-4 ${isTop ? 'mb-0' : 'mb-6'}`}>
                  {[
                    { icon: Star, label: "Premium Content" },
                    { icon: Shield, label: "100% Safe" },
                    { icon: Zap, label: "Fast & Smooth" },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <AnimatedIcon3D 
                        icon={feature.icon} 
                        size={14} 
                        animationType="bounce" 
                        delay={i * 0.2}
                        className="text-primary"
                      />
                      <span>{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="hero"
                  size={isTop ? "default" : "lg"}
                  onClick={handleDownload}
                  className={`${isTop ? 'px-6' : 'px-8 py-6 text-lg'} relative overflow-hidden group`}
                  data-magnetic
                >
                  {/* Button flash effect */}
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                  
                  <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                  Download APK
                </Button>
              </motion.div>
            </div>

            {/* Bottom version info for larger variant */}
            {!isTop && (
              <motion.div
                className="mt-6 pt-6 border-t border-border/30 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span>Version: 1.0.0</span>
                <span>Size: ~15 MB</span>
                <span>Android 5.0+</span>
              </motion.div>
            )}
          </motion.div>
        </Tilt3D>

        {/* Support Section - only show once on bottom variant */}
        {!isTop && (
          <motion.div
            className="mt-6 glass-card rounded-2xl p-6 border border-accent/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full">
                <span className="text-sm font-bold text-destructive">📢 Support PrepPro Network</span>
              </div>
              
              <div className="max-w-2xl space-y-2">
                <h4 className="text-lg font-bold text-foreground">
                  Get Ultimate Update for JEE & NEET — Support PrepPro Network ❤️
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The PrepPro Network Team is working day and night to provide <span className="font-semibold text-foreground">free JEE & NEET resources</span> so that students who cannot afford expensive courses can still study. We don't ask for money — we just ask for <span className="font-semibold text-foreground">one small click</span> to support our work. Your one click motivates us to keep helping thousands of students.
                </p>
                <p className="text-xs text-muted-foreground italic mt-2">
                  PrepPro Network – Students helping Students 🤝
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => window.open("https://gplinks.co/UKMTht", "_blank")}
                  className="px-8 relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                  />
                  ❤️ Support Us — Open Link
                </Button>
              </motion.div>
              <p className="text-xs text-muted-foreground">Opens externally • For web users only</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AppDownloadBanner;
