import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewerPage = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No URL provided</h1>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Bar */}
      <div className="h-14 glass-navbar flex items-center justify-between px-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(url, "_blank")}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </Button>
      </div>
      
      {/* Iframe Container */}
      <div className="flex-1 relative">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ViewerPage;
