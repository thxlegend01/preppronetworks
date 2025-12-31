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

// Apps that SHOULD show the thank you message (only these 4)
const SHOW_MESSAGE_APPS = ["raw-app", "kgs-app", "selection-way-app", "cds-app"];

// Admin passwords that work for ALL content (case-insensitive)
const ADMIN_PASSWORDS = ["preppro network", "i am admin"];

// App-specific passwords (case-insensitive)
const APP_PASSWORDS: Record<string, string> = {
  "pw-app": "pw",
  "raw-app": "raw",
  "kgs-app": "kgs",
  "selection-way-app": "sw",
  "cds-app": "cds",
  "next-toppers-app": "nt",
  "unacademy-app": "un",
  "mathango-test-series": "mathango",
  "revision-course-app": "revision",
  "pyq-cbt-test": "pyq",
};

// Password display names for hints
const APP_PASSWORD_HINTS: Record<string, string> = {
  "pw-app": "pw",
  "raw-app": "raw",
  "kgs-app": "kgs",
  "selection-way-app": "sw",
  "cds-app": "cds",
  "next-toppers-app": "nt",
  "unacademy-app": "un",
  "mathango-test-series": "mathango",
  "revision-course-app": "revision",
  "pyq-cbt-test": "pyq",
  "study-material": "study",
};

// Study material password
const STUDY_MATERIAL_PASSWORD = "study";

const PasswordGate = ({ onSuccess, onCancel, title, appId = "" }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const shouldShowMessage = SHOW_MESSAGE_APPS.includes(appId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPassword = password.toLowerCase().trim();
    
    // Check if password is valid
    const isAdminPassword = ADMIN_PASSWORDS.includes(normalizedPassword);
    const appSpecificPassword = APP_PASSWORDS[appId] || "";
    const isAppSpecificPassword = normalizedPassword === appSpecificPassword;
    const isStudyMaterialPassword = appId === "study-material" && normalizedPassword === STUDY_MATERIAL_PASSWORD;
    
    if (isAdminPassword || isAppSpecificPassword || isStudyMaterialPassword) {
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
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
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
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse pink-glow">
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

        {/* Password hint */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-muted-foreground">
            Password: <span className="font-mono bg-secondary/50 px-2 py-1 rounded text-primary">{APP_PASSWORD_HINTS[appId] || "preppro network"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;