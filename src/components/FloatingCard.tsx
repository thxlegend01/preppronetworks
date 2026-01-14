import { useEffect, useState, ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  floatIntensity?: number;
  floatSpeed?: number;
  disabled?: boolean;
}

const FloatingCard = ({
  children,
  className = "",
  floatIntensity = 8,
  floatSpeed = 4,
  disabled = false,
}: FloatingCardProps) => {
  const [offset, setOffset] = useState({ y: 0, rotate: 0 });

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (disabled || prefersReducedMotion) return;

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const y = Math.sin(elapsed / floatSpeed * Math.PI * 2) * floatIntensity;
      const rotate = Math.sin(elapsed / (floatSpeed * 1.5) * Math.PI * 2) * 1;
      
      setOffset({ y, rotate });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [floatIntensity, floatSpeed, disabled, prefersReducedMotion]);

  return (
    <div
      className={`will-change-transform ${className}`}
      style={{
        transform: `translateY(${offset.y}px) rotate(${offset.rotate}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default FloatingCard;
