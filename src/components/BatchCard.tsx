import { useState } from "react";
import { ArrowRight, PlayCircle, Radio, ExternalLink, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import type { Batch } from "@/lib/data";
import DisclaimerDialog from "./DisclaimerDialog";
import AccessCodeDialog from "./AccessCodeDialog";
import { useAuth } from "@/hooks/useAuth";

interface BatchCardProps {
  batch: Batch;
  index?: number;
}

const BatchCard = ({ batch, index = 0 }: BatchCardProps) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accessCodeOpen, setAccessCodeOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccessClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowDisclaimer(true);
  };

  return (
    <>
      <div
        className="glass-card card-hover shine-effect rounded-2xl overflow-hidden animate-fade-in group"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
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
            <Button 
              variant="secondary" 
              className="w-full bg-success/20 text-success hover:bg-success/30 border border-success/30"
              onClick={() => setAccessCodeOpen(true)}
            >
              <Key className="mr-2 w-4 h-4" />
              Access Code
            </Button>
          </div>
        </div>
      </div>

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

      <AccessCodeDialog
        isOpen={accessCodeOpen}
        onClose={() => setAccessCodeOpen(false)}
      />
    </>
  );
};

export default BatchCard;
