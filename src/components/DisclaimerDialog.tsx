import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DisclaimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  externalUrl: string;
}

const DisclaimerDialog = ({
  isOpen,
  onClose,
  onContinue,
  externalUrl,
}: DisclaimerDialogProps) => {
  const [countdown, setCountdown] = useState(4);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(4);
      setCanSkip(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleContinue = () => {
    onContinue();
    window.open(externalUrl, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-warning/30">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Important Notice
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed mt-4">
            This site isn't made by us. We are just giving access to this site to many students for free. 
            If you have any objection, please mail us at{" "}
            <a 
              href="mailto:thxlegend01era@gmail.com" 
              className="text-primary hover:underline font-medium"
            >
              thxlegend01era@gmail.com
            </a>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleContinue}
            disabled={!canSkip}
            variant="hero"
            className="w-full font-bold"
          >
            {canSkip ? "Skip & Continue" : `Please wait... ${countdown}s`}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerDialog;
