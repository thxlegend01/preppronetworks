import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "rotate";
  duration?: number;
  once?: boolean;
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 600,
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [once, prefersReducedMotion]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(60px) translateZ(-50px)";
      case "down":
        return "translateY(-60px) translateZ(-50px)";
      case "left":
        return "translateX(60px) translateZ(-50px)";
      case "right":
        return "translateX(-60px) translateZ(-50px)";
      case "scale":
        return "scale(0.8) translateZ(-100px)";
      case "rotate":
        return "rotateX(15deg) translateZ(-50px)";
      default:
        return "translateY(60px)";
    }
  };

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        transform: isVisible ? "translateY(0) translateZ(0) scale(1) rotateX(0)" : getInitialTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
