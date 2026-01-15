import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    rotateX: 2,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    rotateX: -2,
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
  mass: 0.8,
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
