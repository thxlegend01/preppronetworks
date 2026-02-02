import { useState } from "react";
import { ArrowRight, PlayCircle, Radio, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import type { Batch } from "@/lib/data";
import { APP_ACCESS_CODES } from "@/lib/data";
import DisclaimerDialog from "./DisclaimerDialog";
import { useAuth } from "@/hooks/useAuth";
import Card3DGallery from "./Card3DGallery";
import { useToast } from "@/hooks/use-toast";

interface BatchCardProps {
  batch: Batch;
  index?: number;
}

const BatchCard = ({ batch, index = 0 }: BatchCardProps) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this app has a specific access code
  const appCode = APP_ACCESS_CODES[batch.id];

  const handleAccessClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowDisclaimer(true);
  };

  const handleCopyCode = async () => {
    if (!appCode) return;
    
    try {
      await navigator.clipboard.writeText(appCode.code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: `${appCode.code} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy manually: " + appCode.code,
      });
    }
  };

  return (
    <>
      <Card3DGallery index={index} className="h-full">
        <div className="glass-card shine-effect rounded-2xl overflow-hidden h-full group">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={batch.image}
              alt={batch.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                variant="secondary"
                className={`${
                  batch.status === "Live"
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-primary/20 text-primary border-primary/30"
                } flex items-center gap-1.5`}
              >
                {batch.status === "Live" ? (
                  <Radio className="w-3 h-3 animate-pulse" />
                ) : (
                  <PlayCircle className="w-3 h-3" />
                )}
                {batch.status}
              </Badge>
            </div>
            
            {/* Category */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                {batch.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {batch.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">
              {batch.description}
            </p>

            {/* CTAs */}
            <div className="space-y-2">
              <Button 
                variant="hero"
                onClick={handleAccessClick}
                className="w-full"
              >
                <ExternalLink className="mr-2 w-4 h-4" />
                {user ? "Access Now" : "Login to Access"}
              </Button>
              <Link to={`/batches/${batch.id}`} className="block">
                <Button variant="outline" className="w-full border-border/50 hover:border-primary/50">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {/* Show copy code button only for apps with specific codes */}
              {appCode && (
                <Button 
                  variant="secondary" 
                  className="w-full bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 w-4 h-4" />
                      {appCode.label}: {appCode.code}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card3DGallery>

      <DisclaimerDialog
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onContinue={() => {}}
        externalUrl={batch.externalUrl}
        batchTitle={batch.title}
        openInternal={batch.openInternal}
        showLoadingAnimation={batch.showLoadingAnimation}
        openExternalAfterLoading={batch.openExternalAfterLoading}
      />
    </>
  );
};

export default BatchCard;