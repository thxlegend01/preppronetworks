import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Search, ArrowRight } from "lucide-react";

interface CwNoticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const CwNoticeDialog = ({ isOpen, onClose, onContinue }: CwNoticeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-primary/30">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <Info className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Before You Enter
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed mt-4 space-y-3">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-left space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Quick Tips for Best Experience
              </p>
              <ul className="space-y-1.5 text-muted-foreground text-xs">
                <li>📚 This app contains <span className="font-semibold text-foreground">many batches</span> from different coaching institutes</li>
                <li>🔍 For <span className="font-semibold text-foreground">JEE batches</span>, search "<span className="text-primary font-bold">JEE</span>" in the search bar</li>
                <li>🔍 For <span className="font-semibold text-foreground">NEET batches</span>, search "<span className="text-primary font-bold">NEET</span>"</li>
                <li>⚡ Use the search feature for a <span className="font-semibold text-foreground">better & faster experience</span></li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={onContinue}
            variant="hero"
            className="w-full font-bold"
          >
            Got it, Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CwNoticeDialog;
