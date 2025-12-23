import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
}

const PasswordDialog = ({
  isOpen,
  onClose,
  onSuccess,
  correctPassword,
}: PasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setError(false);
      setPassword("");
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass-card border-primary/30">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Members Only Access
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed mt-4">
            This content is password protected. Please enter the access code to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`pr-10 ${error ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-destructive text-sm">Incorrect password. Please try again.</p>
          )}
          <div className="flex flex-col gap-3">
            <Button type="submit" variant="hero" className="w-full font-bold">
              Access Content
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
