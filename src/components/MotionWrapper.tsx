import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface MotionWrapperProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "rotate";
  duration?: number;
}

const MotionWrapper = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  ...motionProps
}: MotionWrapperProps) => {
  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50, rotateX: 5 };
      case "down":
        return { opacity: 0, y: -50, rotateX: -5 };
      case "left":
        return { opacity: 0, x: 50, rotateY: -5 };
      case "right":
        return { opacity: 0, x: -50, rotateY: 5 };
      case "scale":
        return { opacity: 0, scale: 0.9, rotateX: 3 };
      case "rotate":
        return { opacity: 0, rotateX: 15, scale: 0.95 };
      default:
        return { opacity: 0, y: 50 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialState()}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
      }}
      style={{
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
