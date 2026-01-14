import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import prepproLogo from "@/assets/preppro-network-logo.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // If there's no session and no hash fragment, redirect to auth
      if (!session && !window.location.hash.includes('type=recovery')) {
        setIsValidLink(false);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message,
      });
    } else {
      setIsSuccess(true);
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });
      setTimeout(() => navigate("/auth"), 3000);
    }
  };

  if (!isValidLink) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8 max-w-md text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Invalid or Expired Link</h2>
              <p className="text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/auth">
                <Button variant="hero" className="w-full">
                  Back to Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </PageTransition>
    );
  }

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8 max-w-md text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Password Reset Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been updated. Redirecting you to login...
              </p>
              <Link to="/auth">
                <Button variant="hero" className="w-full">
                  Go to Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="absolute inset-0 radial-glow opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <ScrollReveal className="relative z-10 w-full max-w-md">
          <div className="glass-card rounded-2xl p-8">
            <Link to="/" className="flex items-center justify-center gap-3 mb-8">
              <img 
                src={prepproLogo} 
                alt="PrepPro Network" 
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30"
              />
              <span className="text-xl font-bold text-gradient">PrepPro Network</span>
            </Link>

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Set New Password</h2>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    {...form.register("confirmPassword")}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/auth" className="text-sm text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
};

export default ResetPasswordPage;
