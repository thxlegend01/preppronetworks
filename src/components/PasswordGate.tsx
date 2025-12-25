import { useState } from "react";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
  appId?: string;
}

// Apps that should NOT show the thank you message
const NO_MESSAGE_APPS = ["pw-app", "mathango-test-series"];

// Common passwords that work for all apps
const COMMON_PASSWORDS = ["preppro network", "saurabh", "kl rahul"];

// App-specific passwords
const APP_PASSWORDS: Record<string, string> = {
  "pw-app": "pw by preppro",
  "raw-app": "rwa by preppro",
  "kgs-app": "kgs by preppro",
  "selection-way-app": "selection way by preppro",
  "cds-app": "cds by preppro",
  "next-toppers-app": "next toppers by preppro",
  "unacademy-app": "unacademy by preppro",
  "mathango-test-series": "mathango by preppro",
  "other-test-series": "test series by preppro",
  "study-material": "study material by preppro",
  "pyq-cbt": "pyq by preppro",
  "revision-course": "revision by preppro",
  "pyq-cbt-test": "pyq by preppro",
  "revision-course-app": "revision by preppro",
};

const PasswordGate = ({ onSuccess, onCancel, title, appId = "" }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const shouldShowMessage = !NO_MESSAGE_APPS.includes(appId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPassword = password.toLowerCase().trim();
    
    // Check if password is valid (common or app-specific)
    const isCommonPassword = COMMON_PASSWORDS.includes(normalizedPassword);
    const appSpecificPassword = APP_PASSWORDS[appId] || "";
    const isAppSpecificPassword = normalizedPassword === appSpecificPassword;
    
    if (isCommonPassword || isAppSpecificPassword) {
      // Store access in session
      sessionStorage.setItem("preppro_access", "granted");
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

  // Thank you message screen
  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 radial-glow opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="glass-card rounded-2xl p-8 max-w-md w-full relative z-10 animate-fade-in text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Access Granted!
          </h2>
          <p className="text-lg text-primary font-semibold mb-2">
            Thanks to Spidy Universe for this gesture
          </p>
          <p className="text-muted-foreground text-sm">
            Redirecting to {title}...
          </p>
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
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Members Only Access
          </h1>
          <p className="text-muted-foreground">
            Enter the access code to open <span className="text-primary font-semibold">{title}</span>
          </p>
        </div>

        {/* Form */}
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
              Incorrect code. Please try again.
            </p>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Access Content
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

        {/* Hint */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Contact admin for access code
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
