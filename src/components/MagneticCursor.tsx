import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MagneticCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverScale, setHoverScale] = useState(1);
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorDotX = useMotionValue(-100);
  const cursorDotY = useMotionValue(-100);

  const springConfig = { stiffness: 300, damping: 28 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const dotSpringConfig = { stiffness: 500, damping: 30 };
  const smoothDotX = useSpring(cursorDotX, dotSpringConfig);
  const smoothDotY = useSpring(cursorDotY, dotSpringConfig);

  // Check for reduced motion or touch device
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const isTouchDevice = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorDotX.set(e.clientX);
    cursorDotY.set(e.clientY);

    // Check for magnetic elements
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    let foundMagnetic = false;

    magneticElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const magnetRadius = 80;

      if (distance < magnetRadius) {
        foundMagnetic = true;
        const strength = 1 - distance / magnetRadius;
        const magnetX = centerX + (e.clientX - centerX) * strength * 0.3;
        const magnetY = centerY + (e.clientY - centerY) * strength * 0.3;
        
        cursorX.set(magnetX);
        cursorY.set(magnetY);
        setHoverScale(1.5 + strength * 0.5);
        setIsHovering(true);
      }
    });

    if (!foundMagnetic) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHoverScale(1);
      setIsHovering(false);
    }
  }, [cursorX, cursorY, cursorDotX, cursorDotY]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, prefersReducedMotion, isTouchDevice]);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: hoverScale,
        }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-white/80"
          style={{
            boxShadow: isHovering ? "0 0 20px rgba(255,255,255,0.3)" : "none",
          }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothDotX,
          y: smoothDotY,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-white" />
      </motion.div>

      {/* Glow effect on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: smoothX,
            y: smoothY,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="w-20 h-20 -ml-10 -mt-10 rounded-full bg-primary/30 blur-xl" />
        </motion.div>
      )}
    </>
  );
};

export default MagneticCursor;
