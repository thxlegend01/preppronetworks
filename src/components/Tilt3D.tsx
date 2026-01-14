import { useRef, useState, useCallback, ReactNode } from "react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  scale?: number;
  glowColor?: string;
  disabled?: boolean;
}

const Tilt3D = ({ 
  children, 
  className = "", 
  intensity = 15, 
  scale = 1.02,
  glowColor = "hsl(var(--primary))",
  disabled = false 
}: Tilt3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  // Check for reduced motion preference or low-end device
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return;
    
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }, [intensity, scale, disabled, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  // Touch support
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return;
    
    const element = ref.current;
    if (!element) return;

    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -(intensity * 0.5);
    const rotateY = ((x - centerX) / centerX) * (intensity * 0.5);

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    setIsHovering(true);
  }, [intensity, scale, disabled, prefersReducedMotion]);

  const handleTouchEnd = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic glow effect */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovering ? 0.6 : 0,
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor} / 0.3, transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
};

export default Tilt3D;
