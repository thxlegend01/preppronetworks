import { useState } from "react";
import { Lock, Eye, EyeOff, Shield, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessCode } from "@/hooks/useAccessCode";

interface PasswordGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
  appId?: string;
}

// Normalize code by removing spaces and converting to lowercase
const normalizeCode = (code: string): string => {
  return code.toLowerCase().replace(/\s+/g, "").trim();
};

// Valid universal code (case-insensitive, space-insensitive)
const VALID_CODES = ["preppronetwork"]; // "PrepPro Network" normalized

// Admin codes for permanent/unlimited access
const ADMIN_CODES = ["saurabh"];

// Apps that SHOULD show the thank you message (only these 4)
const SHOW_MESSAGE_APPS = ["raw-app", "kgs-app", "selection-way-app", "cds-app"];

const SHORTENER_LINK = "https://gplinks.co/wtGQu";

const PasswordGate = ({ onSuccess, onCancel, title, appId = "" }: PasswordGateProps) => {
  const { hasValidAccess, timeRemaining, grantAccess } = useAccessCode();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const shouldShowMessage = SHOW_MESSAGE_APPS.includes(appId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPassword = normalizeCode(password);
    
    // Check if code is valid
    const isValidCode = VALID_CODES.includes(normalizedPassword);
    const isAdminCode = ADMIN_CODES.includes(normalizedPassword);
    
    if (isValidCode || isAdminCode) {
      // Grant 36-hour access
      grantAccess();
      setError(false);
      
      // Show thank you message for apps that need it
      if (shouldShowMessage) {
        setShowThankYou(true);
        setTimeout(() => {
          onSuccess();
        }, 2500);
      } else {
        onSuccess();
      }
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleOpenShortener = () => {
    window.open(SHORTENER_LINK, "_blank");
  };

  // If user already has valid access, grant immediately
  if (hasValidAccess && !showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 radial-glow opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="glass-card rounded-2xl p-8 max-w-md w-full relative z-10 animate-fade-in text-center">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Active!
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            <span>Time remaining: <span className="text-primary font-semibold">{timeRemaining}</span></span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Opening <span className="text-primary font-semibold">{title}</span>...
          </p>
          
          {/* Warning notice */}
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-left text-warning-foreground">
                Access will be denied after the timer expires. Get a new code from the shortener.
              </p>
            </div>
          </div>

          <Button 
            onClick={onSuccess}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Continue to {title}
          </Button>
        </div>
      </div>
    );
  }

  // Thank you message screen
  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 radial-glow opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="glass-card rounded-2xl p-8 max-w-md w-full relative z-10 animate-fade-in text-center">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Access Granted!
          </h2>
          <p className="text-lg text-primary font-semibold mb-2">
            Thanks to Spidy Universe for this gesture
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            Redirecting to {title}...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-success">
            <Clock className="w-4 h-4" />
            <span>36-hour access activated!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 radial-glow opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className={`glass-card rounded-2xl p-8 max-w-md w-full relative z-10 animate-fade-in ${shake ? 'animate-shake' : ''}`}>
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse pink-glow">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Members Only Access
          </h1>
          <p className="text-muted-foreground">
            Enter the access code to open <span className="text-primary font-semibold">{title}</span>
          </p>
        </div>

        {/* Step 1: Get Code */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
            <span className="font-semibold text-foreground text-sm">Get Your Access Code</span>
          </div>
          <Button 
            onClick={handleOpenShortener}
            variant="outline"
            className="w-full bg-success/10 text-success border-success/30 hover:bg-success/20"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Get Access Code
          </Button>
        </div>

        {/* Step 2: Enter Code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
            <span className="font-semibold text-foreground text-sm">Enter the Code</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter access code"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`pl-10 pr-10 h-12 text-lg ${error ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <p className="text-destructive text-sm text-center animate-fade-in">
                Invalid code. Please get the code from the link above.
              </p>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Unlock Access (36 Hours)
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Go Back
            </Button>
          </form>
        </div>

        {/* Timer Notice */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-1">36-Hour Access</p>
              <p className="text-muted-foreground">
                After entering the code, you'll have 36 hours of unlimited access!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
