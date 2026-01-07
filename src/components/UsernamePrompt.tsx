import { useState } from "react";
import { User, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsernamePromptProps {
  userId: string;
  isOpen: boolean;
  onComplete: () => void;
}

const UsernamePrompt = ({ userId, isOpen, onComplete }: UsernamePromptProps) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", value.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setIsAvailable(!data);
    } catch (err) {
      console.error("Error checking username:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric and underscores
    const sanitized = value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    setUsername(sanitized);
    
    // Debounce the check
    const timeout = setTimeout(() => checkUsername(sanitized), 500);
    return () => clearTimeout(timeout);
  };

  const handleSubmit = async () => {
    if (!username || username.length < 3 || !isAvailable) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.toLowerCase() })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Username set!",
        description: `Your username is now @${username}`,
      });
      onComplete();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to set username",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Set Your Username
          </DialogTitle>
          <DialogDescription>
            Please choose a unique username for your account. This will be visible to others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                placeholder="your_username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="pl-8 pr-10"
                minLength={3}
                maxLength={20}
              />
              {username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : isAvailable ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {username.length < 3 
                ? "Username must be at least 3 characters"
                : isAvailable === false 
                  ? "This username is already taken"
                  : isAvailable === true 
                    ? "Username is available!"
                    : "Checking availability..."}
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!isAvailable || username.length < 3 || isSubmitting}
          >
            {isSubmitting ? "Setting username..." : "Confirm Username"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernamePrompt;
