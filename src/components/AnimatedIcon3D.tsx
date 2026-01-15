import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIcon3DProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
  animationType?: "rotate" | "bounce" | "pulse" | "float" | "spin3d";
  delay?: number;
}

const AnimatedIcon3D = ({
  icon: Icon,
  className = "",
  size = 24,
  color = "currentColor",
  animationType = "float",
  delay = 0,
}: AnimatedIcon3DProps) => {
  const getAnimation = () => {
    switch (animationType) {
      case "rotate":
        return {
          animate: {
            rotateY: [0, 360],
            scale: [1, 1.1, 1],
          },
          transition: {
            duration: 3,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "bounce":
        return {
          animate: {
            y: [0, -10, 0],
            rotateX: [0, 10, 0],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
            rotateZ: [0, 5, 0, -5, 0],
          },
          transition: {
            duration: 2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "float":
        return {
          animate: {
            y: [0, -8, 0],
            rotateY: [0, 15, 0, -15, 0],
          },
          transition: {
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "spin3d":
        return {
          animate: {
            rotateX: [0, 360],
            rotateY: [0, 360],
          },
          transition: {
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "linear",
          },
        };
      default:
        return {
          animate: {},
          transition: {},
        };
    }
  };

  const animation = getAnimation();

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        perspective: "500px",
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, ...animation.animate }}
      transition={animation.transition}
      whileHover={{
        scale: 1.2,
        rotateY: 15,
        rotateX: -10,
      }}
    >
      <Icon size={size} color={color} />
    </motion.div>
  );
};

export default AnimatedIcon3D;
