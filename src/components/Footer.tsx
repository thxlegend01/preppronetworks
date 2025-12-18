import edufinicLogo from "@/assets/edufinic-logo.jpg";

const Footer = () => {
  return (
    <footer id="about" className="border-t border-border py-12 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={edufinicLogo} 
              alt="Edufinic" 
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <div className="font-bold text-lg">Edufinic</div>
              <div className="text-sm text-muted-foreground">Free Education for All</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Mathango 2026 Test Series - Available for free
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 Edufinic. Made with ❤️ for JEE Aspirants
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
