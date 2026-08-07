import { useState } from "react";
import { Lock, Eye, EyeOff, ExternalLink, Clock, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccessCode } from "@/hooks/useAccessCode";

interface AccessCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SHORTENER_LINK = "https://gplinks.co/wtGQu";

const AccessCodeDialog = ({ isOpen, onClose, onSuccess }: AccessCodeDialogProps) => {
  const { hasValidAccess, timeRemaining, verifyCode } = useAccessCode();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [shake, setShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyCode(code);

    if (ok) {
      setError(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setCode("");
        onClose();
        onSuccess?.();
      }, 1500);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleOpenShortener = () => {
    window.open(SHORTENER_LINK, "_blank");
  };

  // Already has valid access
  if (hasValidAccess && !showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-success" />
              Access Active
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-success" />
            </div>
            
            <div>
              <p className="text-foreground font-semibold mb-2">
                You already have access!
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Expires in: <span className="text-primary font-semibold">{timeRemaining}</span></span>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning-foreground text-left">
                  Access will be denied after the timer expires. You'll need to get a new code from the shortener link.
                </p>
              </div>
            </div>
            
            <Button onClick={onClose} className="w-full">
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Success animation
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Access Granted! 🎉
            </h2>
            <p className="text-muted-foreground">
              You now have <span className="text-primary font-semibold">36 hours</span> of access
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Get Access Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Step 1: Get Code */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
              <span className="font-semibold text-foreground">Get Your Access Code</span>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              Click the button below to get your free access code
            </p>
            <Button 
              onClick={handleOpenShortener}
              variant="outline"
              className="w-full ml-0 bg-success/10 text-success border-success/30 hover:bg-success/20"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Access Code
            </Button>
          </div>

          {/* Step 2: Enter Code */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
              <span className="font-semibold text-foreground">Enter the Code</span>
            </div>
            <form onSubmit={handleSubmit} className={`space-y-3 ml-0 ${shake ? 'animate-shake' : ''}`}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showCode ? "text" : "password"}
                  placeholder="Enter access code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  className={`pl-10 pr-10 ${error ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {error && (
                <p className="text-destructive text-sm text-center animate-fade-in">
                  Invalid code. Please try again.
                </p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Unlock Access (36 Hours)
              </Button>
            </form>
          </div>

          {/* Timer Notice */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">36-Hour Access</p>
                <p className="text-muted-foreground">
                  After entering the code, you'll have 36 hours of unlimited access. No need to enter the code again during this period!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCodeDialog;
