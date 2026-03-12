import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DisclaimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  externalUrl: string;
  batchTitle?: string;
  openInternal?: boolean;
  showLoadingAnimation?: boolean;
  openExternalAfterLoading?: boolean;
}

const DisclaimerDialog = ({
  isOpen,
  onClose,
  onContinue,
  externalUrl,
  batchTitle = "",
  openInternal = true,
  showLoadingAnimation = false,
  openExternalAfterLoading = false,
}: DisclaimerDialogProps) => {
  const [countdown, setCountdown] = useState(4);
  const [canSkip, setCanSkip] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !showLoading) {
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
  }, [isOpen, showLoading]);

  useEffect(() => {
    if (showLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      const timeout = setTimeout(() => {
        if (openExternalAfterLoading) {
          window.open(externalUrl, "_blank");
        } else if (openInternal) {
          navigate(`/viewer?url=${encodeURIComponent(externalUrl)}`);
        } else {
          window.open(externalUrl, "_blank");
        }
        setShowLoading(false);
        onClose();
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showLoading, externalUrl, openInternal, openExternalAfterLoading, navigate, onClose]);

  const handleContinue = () => {
    if (showLoadingAnimation || openExternalAfterLoading) {
      setShowLoading(true);
    } else {
      onClose();
    }
    onContinue();
  };

  const handleClose = () => {
    setShowLoading(false);
    setLoadingProgress(0);
    onClose();
  };

  // Loading Animation View
  if (showLoading) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md glass-card border-primary/30 text-center" hideCloseButton>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Loading {batchTitle}
              </h3>
              <p className="text-muted-foreground text-sm">
                Please wait while we prepare your content...
              </p>
            </div>

            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{loadingProgress}%</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            onClick={handleClose}
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
