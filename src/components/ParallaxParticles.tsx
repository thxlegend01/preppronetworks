import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  shape: "circle" | "square" | "triangle" | "hexagon";
}

const ParallaxParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Generate particles
    const shapes: Particle["shape"][] = ["circle", "square", "triangle", "hexagon"];
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
      opacity: Math.random() * 0.3 + 0.1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize to -20 to 20 range for parallax
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const renderShape = (shape: Particle["shape"]) => {
    switch (shape) {
      case "circle":
        return <circle cx="50%" cy="50%" r="40%" fill="currentColor" />;
      case "square":
        return <rect x="10%" y="10%" width="80%" height="80%" fill="currentColor" />;
      case "triangle":
        return <polygon points="50,10 90,90 10,90" fill="currentColor" />;
      case "hexagon":
        return <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="currentColor" />;
      default:
        return <circle cx="50%" cy="50%" r="40%" fill="currentColor" />;
    }
  };

  if (prefersReducedMotion) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            x: parallaxX,
            y: parallaxY,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            style={{ opacity: particle.opacity }}
          >
            {renderShape(particle.shape)}
          </svg>
        </motion.div>
      ))}

      {/* Larger floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            width: 100 + i * 50,
            height: 100 + i * 50,
            x: parallaxX,
            y: parallaxY,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxParticles;
