import { useState } from "react";
import { ArrowRight, Play, Users, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Tilt3D from "./Tilt3D";

const stats = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: BookOpen, value: "200+", label: "Courses" },
  { icon: Trophy, value: "95%", label: "Success Rate" },
];

const Hero = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonId: string, targetId: string) => {
    setActiveButton(buttonId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setActiveButton(null), 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects - GPU optimized with will-change */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 radial-glow will-change-transform" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Animated gradient orbs - reduced for performance */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] will-change-opacity"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] will-change-opacity"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.2, 0.15] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Welcome to the Future of Learning</span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight"
          >
            <span className="text-foreground">Prep like a Pro</span>
            <br />
            <motion.span 
              className="text-gradient inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(var(--primary) / 0.3)",
                  "0 0 40px hsl(var(--primary) / 0.5)",
                  "0 0 20px hsl(var(--primary) / 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              With PrepPro
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join India's most comprehensive learning platform. Access premium batches, 
            practice tests, and expert mentorship to crack JEE, NEET, NDA & more.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
          >
            <Tilt3D intensity={8} scale={1.02}>
              <Button 
                variant="hero"
                size="lg" 
                className={`text-lg px-8 py-7 transition-all duration-200 ${activeButton === 'apps' ? 'scale-95 brightness-90' : ''}`}
                onClick={() => handleButtonClick('apps', 'apps')}
                data-magnetic
              >
                Explore Apps
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Tilt3D>
            <Tilt3D intensity={8} scale={1.02}>
              <Button 
                variant="hero"
                size="lg" 
                className={`text-lg px-8 py-7 transition-all duration-200 ${activeButton === 'test-series' ? 'scale-95 brightness-90' : ''}`}
                onClick={() => handleButtonClick('test-series', 'test-series')}
                data-magnetic
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform" />
                Explore Test Series
              </Button>
            </Tilt3D>
          </motion.div>

          {/* Study Material Shortcut */}
          <motion.div variants={itemVariants} className="flex justify-center mb-16">
            <Tilt3D intensity={8} scale={1.02}>
              <Button 
                variant="hero"
                size="lg" 
                className={`text-lg px-6 py-6 transition-all duration-200 ${activeButton === 'study-material' ? 'scale-95 brightness-90' : ''}`}
                onClick={() => handleButtonClick('study-material', 'study-material')}
              >
                <BookOpen className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform" />
                Explore Study Material
              </Button>
            </Tilt3D>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <Tilt3D key={stat.label} intensity={10} scale={1.05}>
                <motion.div 
                  className="flex items-center gap-3 group cursor-default p-3 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-110 group-hover:border-primary/60 transition-all duration-300">
                    <stat.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              </Tilt3D>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
