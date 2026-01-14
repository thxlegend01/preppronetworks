import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, AtSign, Check, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/PageTransition";
import prepproLogo from "@/assets/preppro-network-logo.jpg";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import Tilt3D from "@/components/Tilt3D";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username is too long").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const savedEmail = rememberMe ? localStorage.getItem("savedEmail") || "" : "";

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: savedEmail, password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", displayName: "", email: "", password: "", confirmPassword: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const checkUsernameAvailable = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();
      setUsernameAvailable(!data);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    let email = data.identifier;
    if (!data.identifier.includes("@")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", data.identifier.toLowerCase())
        .maybeSingle();
      
      if (!profile) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Username not found. Please check and try again.",
        });
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Please use email",
        description: "Username login requires email. Please enter your email address.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
      });
    } else {
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    if (!usernameAvailable) {
      toast({
        variant: "destructive",
        title: "Username not available",
        description: "Please choose a different username.",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.displayName, data.username.toLowerCase());
    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      }
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to PrepPro Network!",
      });
      navigate("/");
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setForgotPasswordSent(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for the password reset link.",
      });
    }
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="absolute inset-0 radial-glow opacity-50" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          <ScrollReveal className="relative z-10 w-full max-w-md">
            <Tilt3D intensity={8}>
              <div className="glass-card rounded-2xl p-8">
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                  <img 
                    src={prepproLogo} 
                    alt="PrepPro Network" 
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30"
                  />
                  <span className="text-xl font-bold text-gradient">PrepPro Network</span>
                </Link>

                {forgotPasswordSent ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Check Your Email</h2>
                    <p className="text-muted-foreground mb-6">
                      We've sent a password reset link to your email address. Click the link to set a new password.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setForgotPasswordSent(false);
                          forgotPasswordForm.reset();
                        }}
                      >
                        Try Again
                      </Button>
                      <Button 
                        variant="hero" 
                        className="w-full"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordSent(false);
                        }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
                      <p className="text-muted-foreground">
                        No worries! Enter your email and we'll send you a reset link.
                      </p>
                    </div>

                    <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-foreground">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            {...forgotPasswordForm.register("email")}
                          />
                        </div>
                        {forgotPasswordForm.formState.errors.email && (
                          <p className="text-xs text-destructive">{forgotPasswordForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        variant="hero"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Login
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Tilt3D>
          </ScrollReveal>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 pink-blob animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 pink-blob animate-float" />
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
            <ScrollReveal delay={100}>
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <Tilt3D intensity={20}>
                  <img 
                    src={prepproLogo} 
                    alt="PrepPro Network" 
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/30 group-hover:ring-primary/60 transition-all"
                  />
                </Tilt3D>
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h1 className="text-4xl font-bold text-gradient mb-4">PrepPro Network</h1>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-xl text-muted-foreground max-w-md">
                Your ultimate destination for exam preparation with curated resources and test series
              </p>
            </ScrollReveal>
            
            <div className="mt-12 space-y-4">
              <ScrollReveal delay={400}>
                <Tilt3D intensity={10}>
                  <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Access premium study materials</span>
                  </div>
                </Tilt3D>
              </ScrollReveal>
              <ScrollReveal delay={500}>
                <Tilt3D intensity={10}>
                  <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">Track your progress</span>
                  </div>
                </Tilt3D>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link to="/" className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <img 
                src={prepproLogo} 
                alt="PrepPro Network" 
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30"
              />
              <span className="text-xl font-bold text-gradient">PrepPro Network</span>
            </Link>

            <ScrollReveal>
              <Tilt3D intensity={5}>
                <div className="glass-card rounded-2xl p-8">
                  {/* Security Notice */}
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">🔒 Your Data is Safe</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          This login is only for website security purposes. Your data is encrypted and never shared with owners or any third party.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {isLogin ? "Welcome back" : "Create an account"}
                    </h2>
                    <p className="text-muted-foreground">
                      {isLogin 
                        ? "Enter your email to access your account" 
                        : "Start your preparation journey today"}
                    </p>
                  </div>

                  {/* Toggle buttons */}
                  <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl mb-6">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isLogin 
                          ? "bg-background text-foreground shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        !isLogin 
                          ? "bg-background text-foreground shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {isLogin ? (
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-identifier" className="text-foreground">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-identifier"
                            type="text"
                            placeholder="you@example.com"
                            className="pl-10"
                            {...loginForm.register("identifier")}
                          />
                        </div>
                        {loginForm.formState.errors.identifier && (
                          <p className="text-xs text-destructive">{loginForm.formState.errors.identifier.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="text-foreground">Password</Label>
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...loginForm.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      {/* Remember Me Checkbox */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                        />
                        <Label 
                          htmlFor="remember-me" 
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Remember my email for easy login
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        variant="hero"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-foreground">Username</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-username"
                            type="text"
                            placeholder="your_username"
                            className="pl-10 pr-10"
                            {...signupForm.register("username", {
                              onChange: (e) => {
                                const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
                                e.target.value = value;
                                checkUsernameAvailable(value);
                              }
                            })}
                          />
                          {signupForm.watch("username").length >= 3 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {checkingUsername ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              ) : usernameAvailable ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                              )}
                            </div>
                          )}
                        </div>
                        {signupForm.formState.errors.username ? (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.username.message}</p>
                        ) : usernameAvailable === false ? (
                          <p className="text-xs text-destructive">This username is already taken</p>
                        ) : usernameAvailable === true ? (
                          <p className="text-xs text-green-500">Username is available!</p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-foreground">Display Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-10"
                            {...signupForm.register("displayName")}
                          />
                        </div>
                        {signupForm.formState.errors.displayName && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.displayName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            {...signupForm.register("email")}
                          />
                        </div>
                        {signupForm.formState.errors.email && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...signupForm.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-foreground">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10"
                            {...signupForm.register("confirmPassword")}
                          />
                        </div>
                        {signupForm.formState.errors.confirmPassword && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        variant="hero"
                        className="w-full"
                        disabled={isLoading || !usernameAvailable}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  )}
                </div>
              </Tilt3D>
            </ScrollReveal>

            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
