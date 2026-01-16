import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Smartphone, Star, Check, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface Phone3DMockupProps {
  showDownloadButton?: boolean;
}

const Phone3DMockup = ({ showDownloadButton = true }: Phone3DMockupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/PrepPro-Network.apk";
    link.download = "PrepPro-Network.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    { icon: Check, text: "All Courses Access" },
    { icon: Bell, text: "Push Notifications" },
    { icon: Zap, text: "Offline Mode" },
    { icon: Star, text: "Premium Content" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Phone */}
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: "1200px",
            }}
            className="flex justify-center"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              animate={{
                y: isHovered ? -10 : [0, -20, 0],
              }}
              transition={
                isHovered
                  ? { duration: 0.2 }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative"
            >
              {/* Phone frame */}
              <motion.div
                className="relative w-[280px] h-[560px] rounded-[45px] bg-gradient-to-br from-gray-800 via-gray-900 to-black p-2 shadow-2xl"
                style={{
                  boxShadow: isHovered
                    ? "0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px hsl(var(--primary) / 0.4), inset 0 2px 0 rgba(255,255,255,0.1)"
                    : "0 30px 60px -15px rgba(0,0,0,0.3), 0 20px 40px -20px hsl(var(--primary) / 0.2), inset 0 2px 0 rgba(255,255,255,0.1)",
                  transform: "translateZ(20px)",
                }}
              >
                {/* Side buttons */}
                <div
                  className="absolute -right-[3px] top-28 w-[3px] h-10 rounded-r-sm bg-gray-700"
                  style={{ transform: "translateZ(-5px)" }}
                />
                <div
                  className="absolute -right-[3px] top-44 w-[3px] h-16 rounded-r-sm bg-gray-700"
                  style={{ transform: "translateZ(-5px)" }}
                />
                <div
                  className="absolute -left-[3px] top-36 w-[3px] h-20 rounded-l-sm bg-gray-700"
                  style={{ transform: "translateZ(-5px)" }}
                />

                {/* Screen */}
                <motion.div
                  className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-br from-background to-secondary"
                  style={{ transform: "translateZ(5px)" }}
                >
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-800" />
                    <div className="w-3 h-3 rounded-full bg-gray-800 ring-1 ring-gray-700" />
                  </div>

                  {/* App content */}
                  <div className="h-full pt-14 pb-4 px-4 flex flex-col">
                    {/* App Header */}
                    <div className="text-center mb-4">
                      <motion.div
                        className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-2 shadow-lg"
                        animate={{
                          boxShadow: [
                            "0 4px 20px hsl(var(--primary) / 0.3)",
                            "0 8px 30px hsl(var(--primary) / 0.5)",
                            "0 4px 20px hsl(var(--primary) / 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Smartphone className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h4 className="font-bold text-sm">PrepPro Network</h4>
                      <p className="text-[10px] text-muted-foreground">v1.0.0</p>
                    </div>

                    {/* Features list */}
                    <div className="flex-1 space-y-2">
                      {features.map((feature, i) => (
                        <motion.div
                          key={feature.text}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 backdrop-blur-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <feature.icon className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="mt-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        5.0 • 10K+ Downloads
                      </p>
                    </div>

                    {/* Install button inside phone */}
                    <motion.div
                      className="mt-3 bg-primary rounded-lg py-2 text-center text-xs font-semibold text-primary-foreground"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Install App
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute -inset-10 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
                  transform: "translateZ(-50px)",
                }}
                animate={{
                  scale: isHovered ? 1.2 : [1, 1.1, 1],
                  opacity: isHovered ? 0.4 : [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Floating elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-primary/40 pointer-events-none"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 3) * 30}%`,
                    transform: `translateZ(${30 + i * 10}px)`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Android App Available
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Get the{" "}
              <span className="text-gradient">PrepPro Network</span>
              <br />
              App Now
            </h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Experience the full power of PrepPro on your Android device.
              Access all courses, get push notifications for updates, and study
              offline anywhere!
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-3 p-3 rounded-xl glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {showDownloadButton && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleDownload}
                  className="px-8 py-6 text-lg relative overflow-hidden group"
                  data-magnetic
                >
                  <motion.span
                    className="absolute inset-0"
                    animate={{
                      background: [
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      ],
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                  Download APK
                </Button>
              </motion.div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              Version 1.0.0 • ~15 MB • Android 5.0+
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Phone3DMockup;
