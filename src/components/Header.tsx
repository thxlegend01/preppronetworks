import { useState } from "react";
import { Menu, X, LogOut, User, Home, Smartphone, BookOpen, ClipboardCheck, Timer, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const navLinks = [
  { href: "/", label: "Home", icon: Home, isRoute: true },
  { href: "/apps", label: "Apps", icon: Smartphone, isRoute: true },
  { href: "/test-series", label: "Tests", icon: ClipboardCheck, isRoute: true },
  { href: "/study-material", label: "Material", icon: BookOpen, isRoute: true },
  { href: "/study-tracker", label: "Tracker", icon: Timer, isRoute: true },
  { href: "/prepchat", label: "Chat", icon: MessageCircle, isRoute: true },
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
      <header className="fixed top-0 left-0 right-0 z-50 glass-navbar hidden md:block">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-link-style">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-base font-bold text-foreground">PrepPro</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 no-link-style ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                        {getInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer text-sm">
                    <User className="w-3.5 h-3.5 mr-2" />Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive text-sm">
                    <LogOut className="w-3.5 h-3.5 mr-2" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navLinks.slice(0, 5).map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 no-link-style ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          {/* More / Profile button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-muted-foreground"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] animate-fade-in">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border/60 p-6 pb-10 animate-page-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Menu</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMobileMenuOpen(false)}>
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
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}>
                  <User className="w-4 h-4 mr-2" />Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" />Sign Out
                </Button>
              </div>
            ) : (
              <Button className="w-full bg-primary text-primary-foreground rounded-xl" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mobile top bar - minimal */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-navbar">
        <div className="flex items-center justify-between px-4 h-12">
          <Link to="/" className="flex items-center gap-2 no-link-style">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">P</span>
            </div>
            <span className="text-sm font-bold text-foreground">PrepPro</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <NotificationBell />
            {user ? (
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => navigate("/profile")}>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
                    {getInitials(user.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button size="sm" className="h-7 px-3 text-[10px] rounded-lg bg-primary text-primary-foreground" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
