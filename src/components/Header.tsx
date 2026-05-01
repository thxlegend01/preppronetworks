import { useState } from "react";
import { Menu, X, LogOut, User, Home, Smartphone, BookOpen, ClipboardCheck, Timer, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import prepproLogo from "@/assets/preppro-logo.jpg";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/apps", label: "Apps", icon: Smartphone },
  { href: "/test-series", label: "Tests", icon: ClipboardCheck },
  { href: "/study-material", label: "Material", icon: BookOpen },
  { href: "/study-tracker", label: "Tracker", icon: Timer },
  { href: "/prepchat", label: "Chat", icon: MessageCircle },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => email.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="mx-4 mt-3">
          <div className="glass-navbar rounded-2xl px-6 h-14 flex items-center justify-between shadow-sm">
            <Link to="/" className="flex items-center gap-2.5 no-link-style">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-9 h-9 rounded-full overflow-hidden shadow-md border-2 border-primary/20"
              >
                <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">PrepPro Network</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Prep Like a Pro</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1 bg-muted/40 rounded-xl p-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 no-link-style ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <Avatar className="w-8 h-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">
                          {getInitials(user.email || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl">
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer text-sm rounded-lg">
                      <User className="w-3.5 h-3.5 mr-2" />Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive text-sm rounded-lg">
                      <LogOut className="w-3.5 h-3.5 mr-2" />Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  className="h-9 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border/60 p-6 pb-10"
            >
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-5" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Menu</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-1 mb-6">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-link-style ${
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 mb-4">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
                  <Button variant="ghost" className="w-full justify-start text-sm rounded-xl" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}>
                    <User className="w-4 h-4 mr-2" />Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive rounded-xl" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />Sign Out
                  </Button>
                </div>
              ) : (
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl h-12 font-bold" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>
                  Sign In
                </Button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile top bar */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50 glass-navbar"
      >
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/" className="flex items-center gap-2 no-link-style">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border-2 border-primary/20">
              <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-foreground">PrepPro Network</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationBell />
            {user ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate("/profile")}>
                <Avatar className="w-7 h-7 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-[10px] font-bold">
                    {getInitials(user.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button size="sm" className="h-8 px-3 text-[10px] font-bold rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
