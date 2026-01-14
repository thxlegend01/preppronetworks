import { useState, ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PressButtonProps extends ButtonProps {
  children: ReactNode;
  pressDepth?: number;
}

const PressButton = ({ 
  children, 
  className, 
  pressDepth = 4,
  onClick,
  ...props 
}: PressButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <Button
      className={cn(
        "transition-all duration-150 ease-out will-change-transform",
        className
      )}
      style={{
        transform: isPressed 
          ? `translateY(${pressDepth}px) scale(0.98)` 
          : "translateY(0) scale(1)",
        boxShadow: isPressed 
          ? "0 2px 8px rgba(0,0,0,0.2)" 
          : "0 4px 16px rgba(0,0,0,0.15)",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PressButton;
