import { useRef, useState, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DGalleryProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

const Card3DGallery = ({ children, className = "", index = 0 }: Card3DGalleryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Motion values for smooth tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth animation
  const springConfig = { stiffness: 300, damping: 25, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  const scale = useSpring(isHovering ? 1.03 : 1, springConfig);

  // Glow position
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  }, [x, y, prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Touch support
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    
    const element = ref.current;
    if (!element) return;

    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    const normalizedX = (touch.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (touch.clientY - rect.top) / rect.height - 0.5;

    x.set(normalizedX * 0.5); // Reduced sensitivity for touch
    y.set(normalizedY * 0.5);
    setIsHovering(true);
  }, [x, y, prefersReducedMotion]);

  const handleTouchEnd = useCallback(() => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        scale,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 40, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0"
        style={{
          opacity: isHovering ? 0.4 : 0,
          background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, hsl(var(--primary) / 0.4), transparent 60%)`,
        }}
        animate={{
          opacity: isHovering ? 0.4 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{
          opacity: isHovering ? 1 : 0,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
            transform: `translateX(${isHovering ? '100%' : '-100%'})`,
          }}
          animate={{
            transform: isHovering ? 'translateX(100%)' : 'translateX(-100%)',
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Floating shadow */}
      <motion.div
        className="absolute -inset-1 rounded-[inherit] -z-10"
        style={{
          background: 'hsl(var(--primary) / 0.1)',
          filter: 'blur(20px)',
          opacity: isHovering ? 0.6 : 0.2,
        }}
        animate={{
          opacity: isHovering ? 0.6 : 0.2,
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {children}
    </motion.div>
  );
};

export default Card3DGallery;
