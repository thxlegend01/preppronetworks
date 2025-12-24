import { ArrowRight, Smartphone, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DisclaimerDialog from "./DisclaimerDialog";
import ComingSoonDialog from "./ComingSoonDialog";
import { BATCHES } from "@/lib/data";

// Import logos
import pwLogo from "@/assets/pw-logo.jpg";
import rawLogo from "@/assets/raw-logo.jpeg";
import kgsLogo from "@/assets/kgs-logo.png";
import selectionwayLogo from "@/assets/selectionway-logo.png";
import nexttoppersLogo from "@/assets/nexttoppers-logo.png";
import mathangoLogo from "@/assets/mathango-logo.png";
import prepproLogo from "@/assets/preppro-logo.jpg";
import cdsLogo from "@/assets/cds-logo.png";

// Logo mapping
const logoMap: Record<string, string> = {
  "pw-app": pwLogo,
  "raw-app": rawLogo,
  "kgs-app": kgsLogo,
  "selection-way-app": selectionwayLogo,
  "cds-app": cdsLogo,
  "next-toppers-app": nexttoppersLogo,
  "mathango-test-series": mathangoLogo,
  "other-test-series": prepproLogo,
};

const Features = () => {
  const navigate = useNavigate();
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ url: string; title: string; id: string } | null>(null);

  const handleExplore = (id: string, url: string, title: string) => {
    // Handle Coming Soon
    if (url === "coming-soon") {
      setComingSoonOpen(true);
      return;
    }
    
    // Normal flow - show disclaimer first
    setSelectedApp({ url, title, id });
    setDisclaimerOpen(true);
  };

  const handleContinue = () => {
    if (selectedApp) {
      navigate(`/view/${encodeURIComponent(selectedApp.title)}`, {
        state: { url: selectedApp.url, title: selectedApp.title, appId: selectedApp.id }
      });
    }
    setDisclaimerOpen(false);
  };

  const apps = BATCHES.filter(b => b.category === "Apps");
  const testSeries = BATCHES.filter(b => b.category === "Test Series");

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Apps Section */}
        <div id="apps" className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 hover-scale cursor-default">
            <Smartphone className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Educational Apps</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Premium <span className="text-gradient animate-pulse">Apps</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Access top educational platforms for free
          </p>
        </div>
        
        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {apps.map((app, index) => (
            <div 
              key={app.id}
              className="glass-card card-hover shine-effect rounded-2xl p-8 text-center animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Logo */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center mb-6 mx-auto bg-background shadow-lg group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                {logoMap[app.id] ? (
                  <img 
                    src={logoMap[app.id]} 
                    alt={app.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Smartphone className="w-10 h-10 text-primary" />
                )}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{app.title.replace(" App", "")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {app.description}
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleExplore(app.id, app.externalUrl, app.title)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all group/btn hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                Explore Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Test Series Section */}
        <div id="test-series" className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 hover-scale cursor-default">
            <BookOpen className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Test Series</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Premium <span className="text-gradient animate-pulse">Test Series</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Practice with the best test series available
          </p>
        </div>
        
        {/* Test Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testSeries.map((test, index) => (
            <div 
              key={test.id}
              className="glass-card card-hover shine-effect rounded-2xl p-8 text-center animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Logo */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center mb-6 mx-auto bg-background shadow-lg group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                {logoMap[test.id] ? (
                  <img 
                    src={logoMap[test.id]} 
                    alt={test.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-10 h-10 text-primary" />
                )}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{test.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {test.description}
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleExplore(test.id, test.externalUrl, test.title)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all group/btn hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                {test.externalUrl === "coming-soon" ? "Coming Soon" : "Explore Now"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerDialog 
        isOpen={disclaimerOpen} 
        onClose={() => setDisclaimerOpen(false)} 
        onContinue={handleContinue}
        externalUrl={selectedApp?.url || ""}
      />

      <ComingSoonDialog
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        title="Other Test Series"
      />
    </section>
  );
};

export default Features;
