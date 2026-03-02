import { useState } from "react";
import { ArrowRight, Smartphone, ClipboardCheck, Library, Users, BookOpen, Trophy } from "lucide-react";
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
          
          {/* Premium CTA Cards */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full max-w-3xl mx-auto"
          >
            {[
              {
                id: "apps",
                target: "apps",
                icon: Smartphone,
                title: "Explore Premium Apps",
                subtitle: "Access India's top learning platforms",
                gradientFrom: "from-pink-500",
                gradientTo: "to-purple-600",
                glowColor: "hover:shadow-pink-500/30",
              },
              {
                id: "test-series",
                target: "test-series",
                icon: ClipboardCheck,
                title: "Start Test Series",
                subtitle: "Practice like real exam environment",
                gradientFrom: "from-violet-500",
                gradientTo: "to-indigo-600",
                glowColor: "hover:shadow-violet-500/30",
              },
              {
                id: "study-material",
                target: "study-material",
                icon: Library,
                title: "Study Resources",
                subtitle: "Books, PDFs & curated materials",
                gradientFrom: "from-fuchsia-500",
                gradientTo: "to-pink-600",
                glowColor: "hover:shadow-fuchsia-500/30",
              },
            ].map((cta) => (
              <Tilt3D key={cta.id} intensity={6} scale={1.0}>
                <motion.button
                  whileHover={{ y: -6, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleButtonClick(cta.id, cta.target)}
                  className={`group relative w-full min-h-[70px] flex items-center gap-4 px-5 py-4 rounded-[20px] cursor-pointer
                    bg-background/40 backdrop-blur-xl
                    border border-white/15 dark:border-white/10
                    shadow-lg ${cta.glowColor} hover:shadow-2xl
                    transition-all duration-300 ease-out overflow-hidden
                  `}
                >
                  {/* Gradient border glow */}
                  <div className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${cta.gradientFrom} ${cta.gradientTo} opacity-0 group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none`} />
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-[20px]">
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:translate-x-[200%] transition-transform duration-[1200ms] ease-out" />
                  </div>

                  {/* Icon */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${cta.gradientFrom} ${cta.gradientTo} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                    <cta.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Text */}
                  <div className="relative z-10 flex-1 text-left min-w-0">
                    <span className="block text-[15px] sm:text-base font-bold text-foreground leading-tight truncate">{cta.title}</span>
                    <span className="block text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">{cta.subtitle}</span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="relative z-10 flex-shrink-0 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-300" />
                </motion.button>
              </Tilt3D>
            ))}
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
