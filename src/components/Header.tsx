import edufinicLogo from "@/assets/edufinic-logo.jpg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={edufinicLogo} 
            alt="Edufinic Logo" 
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-gradient">Edufinic</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#tests" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Test Series
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-success/20 text-success text-xs font-bold rounded-full animate-pulse">
            100% FREE
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
