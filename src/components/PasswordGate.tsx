import { useState } from "react";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  title: string;
}

const VALID_PASSWORDS = ["legend", "preppro network", "give access"];

const PasswordGate = ({ onSuccess, onCancel, title }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPassword = password.toLowerCase().trim();
    
    if (VALID_PASSWORDS.includes(normalizedPassword)) {
      // Store access in session
      sessionStorage.setItem("preppro_access", "granted");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

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
