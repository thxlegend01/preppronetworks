import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, AtSign, Check, AlertCircle, KeyRound, ArrowLeft, Shield, Zap } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
    
    // If user entered username, look up their email
    if (!data.identifier.includes("@")) {
      try {
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
            description: "Username not found. Please use your email to sign in.",
          });
          return;
        }
        
        // Username found but we need email for auth
        toast({
          variant: "destructive",
          title: "Please use email",
          description: "Please enter your email address to sign in.",
        });
        setIsLoading(false);
        return;
      } catch {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Please check your internet connection and try again.",
        });
        return;
      }
    }

    try {
      const { error } = await signIn(email, data.password);
      
      if (error) {
        let msg = "Something went wrong. Please try again.";
        if (error.message?.includes("Invalid login credentials")) {
          msg = "Invalid email or password. Please try again.";
        } else if (error.message?.includes("Email not confirmed")) {
          msg = "Please verify your email before signing in.";
        } else if (error.message) {
          msg = error.message;
        }
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: msg,
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
          title: "Welcome back! 🎉",
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Unable to connect. Please try again or use the published URL: prepprohub.lovable.app",
      });
    } finally {
      setIsLoading(false);
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
    try {
      const { error } = await signUp(data.email, data.password, data.displayName, data.username.toLowerCase());

      if (error) {
        let errorMessage = error.message;
        if (error.message?.includes("already registered")) {
          errorMessage = "This email is already registered. Please sign in instead.";
        }
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: errorMessage,
        });
      } else {
        toast({
          title: "Account created! 🎉",
          description: "Welcome to PrepPro Network! You're now signed in.",
        });
        navigate("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Unable to connect. Please try again or use the published URL: prepprohub.lovable.app",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        setForgotPasswordSent(true);
        toast({
          title: "Email sent! 📧",
          description: "Check your inbox for the password reset link.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          <motion.div 
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card rounded-3xl p-8 border border-border/50 shadow-2xl">
              <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                <img 
                  src={prepproLogo} 
                  alt="PrepPro Network" 
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/30"
                />
                <span className="text-xl font-bold text-gradient">PrepPro Network</span>
              </Link>

              {forgotPasswordSent ? (
                <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-foreground mb-3">Check Your Email</motion.h2>
                  <motion.p variants={itemVariants} className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    We've sent a password reset link to your email. Click the link to set a new password.
                  </motion.p>
                  <motion.div variants={itemVariants} className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl"
                      onClick={() => { setForgotPasswordSent(false); forgotPasswordForm.reset(); }}
                    >
                      Try Again
                    </Button>
                    <Button 
                      className="w-full rounded-xl bg-primary hover:bg-primary/90"
                      onClick={() => { setShowForgotPassword(false); setForgotPasswordSent(false); }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
                    <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
                  </motion.div>

                  <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 rounded-xl h-11"
                          {...forgotPasswordForm.register("email")}
                        />
                      </div>
                      {forgotPasswordForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{forgotPasswordForm.formState.errors.email.message}</p>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>

                  <motion.div variants={itemVariants} className="mt-6 text-center">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to Login
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-background" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-accent/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <img 
                  src={prepproLogo} 
                  alt="PrepPro Network" 
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-lg"
                />
              </Link>
            </motion.div>

            <motion.h1 
              className="text-4xl font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              PrepPro Network
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your ultimate destination for exam preparation
            </motion.p>
            
            <motion.div 
              className="mt-10 space-y-3 w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { icon: Sparkles, text: "Premium study materials" },
                { icon: Zap, text: "Track your progress" },
                { icon: Shield, text: "100% secure & private" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-3 glass-card p-3.5 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile logo */}
            <Link to="/" className="flex lg:hidden items-center justify-center gap-3 mb-6">
              <img 
                src={prepproLogo} 
                alt="PrepPro Network" 
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/30"
              />
              <span className="text-xl font-bold text-gradient">PrepPro Network</span>
            </Link>

            <div className="glass-card rounded-3xl p-7 border border-border/50 shadow-xl">
              {/* Security Notice */}
              <div className="mb-5 p-3.5 bg-primary/5 border border-primary/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">🔒 Your Data is Safe</p>
                    <p className="text-[11px] text-muted-foreground">Encrypted & never shared with anyone.</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Sign in to your account" : "Start your preparation journey"}
                </p>
              </div>

              {/* Toggle buttons */}
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isLogin 
                      ? "bg-background text-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !isLogin 
                      ? "bg-background text-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form 
                    key="login"
                    onSubmit={loginForm.handleSubmit(handleLogin)} 
                    className="space-y-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="login-identifier" className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-identifier"
                          type="text"
                          placeholder="you@example.com"
                          className="pl-10 rounded-xl h-11"
                          {...loginForm.register("identifier")}
                        />
                      </div>
                      {loginForm.formState.errors.identifier && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.identifier.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm">Password</Label>
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
                          className="pl-10 pr-10 rounded-xl h-11"
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

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember-me" className="text-xs text-muted-foreground cursor-pointer">
                        Remember my email
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="signup"
                    onSubmit={signupForm.handleSubmit(handleSignup)} 
                    className="space-y-3.5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-username" className="text-sm">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-username"
                          type="text"
                          placeholder="your_username"
                          className="pl-10 pr-10 rounded-xl h-11"
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
                        <p className="text-xs text-destructive">Username taken</p>
                      ) : usernameAvailable === true ? (
                        <p className="text-xs text-green-500">Available!</p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name" className="text-sm">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10 rounded-xl h-11"
                          {...signupForm.register("displayName")}
                        />
                      </div>
                      {signupForm.formState.errors.displayName && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.displayName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 rounded-xl h-11"
                          {...signupForm.register("email")}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-password" className="text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            className="pl-10 rounded-xl h-11"
                            {...signupForm.register("password")}
                          />
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-confirm" className="text-sm">Confirm</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            className="pl-10 rounded-xl h-11"
                            {...signupForm.register("confirmPassword")}
                          />
                        </div>
                        {signupForm.formState.errors.confirmPassword && (
                          <p className="text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPassword ? "Hide" : "Show"} password
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      disabled={isLoading || !usernameAvailable}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Creating account...
                        </div>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By continuing, you agree to our Terms of Service.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
