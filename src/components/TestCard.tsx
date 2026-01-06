import { Clock, FileText, Zap, FolderOpen, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AccessCodeDialog from "./AccessCodeDialog";
interface TestCardProps {
  id: string;
  title: string;
  duration: number;
  questions: number;
  subject: string;
  externalUrl?: string;
}

const TestCard = ({ id, title, duration, questions, subject }: TestCardProps) => {
  const navigate = useNavigate();
  const [accessCodeOpen, setAccessCodeOpen] = useState(false);
  
  const handleStartTest = () => {
    navigate(`/test/${id}`);
  };

  const handleOpenPdf = () => {
    window.open("https://drive.google.com/drive/folders/1MJI-qE5ZefI1HyzRc6yAOeTqHJyPcRk_", "_blank");
  };

  return (
    <>
      <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:glow-subtle group">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
            {subject}
          </span>
          <span className="text-xs font-semibold text-success">
            Available Now
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>{questions} Qs</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="hero" 
            className="w-full"
            onClick={handleStartTest}
          >
            <Zap className="w-4 h-4" />
            Start Test
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleOpenPdf}
          >
            <FolderOpen className="w-4 h-4" />
            QFT PDF
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full bg-success/20 text-success hover:bg-success/30 border border-success/30"
            onClick={() => setAccessCodeOpen(true)}
          >
            <Key className="w-4 h-4" />
            Access Code
          </Button>
        </div>
      </div>

      <AccessCodeDialog
        isOpen={accessCodeOpen}
        onClose={() => setAccessCodeOpen(false)}
      />
    </>
  );
};

export default TestCard;
