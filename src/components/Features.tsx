import { ArrowRight, Smartphone, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DisclaimerDialog from "./DisclaimerDialog";
import { BATCHES } from "@/lib/data";

const Features = () => {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

  const handleExplore = (url: string) => {
    setSelectedUrl(url);
    setDisclaimerOpen(true);
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
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Educational Apps</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Premium <span className="text-gradient">Apps</span>
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
              className="glass-card card-hover shine-effect rounded-2xl p-8 text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-6 mx-auto">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground">{app.title.replace(" App", "")}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {app.description}
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleExplore(app.externalUrl)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
              >
                Explore Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Test Series Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Test Series</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Premium <span className="text-gradient">Test Series</span>
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
              className="glass-card card-hover shine-effect rounded-2xl p-8 text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-foreground">{test.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {test.description}
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleExplore(test.externalUrl)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
              >
                Explore Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerDialog 
        isOpen={disclaimerOpen} 
        onClose={() => setDisclaimerOpen(false)} 
        onContinue={() => {}}
        externalUrl={selectedUrl}
      />
    </section>
  );
};

export default Features;