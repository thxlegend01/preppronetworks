import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ComingSoonDialog = ({
  isOpen,
  onClose,
  title = "Other Test Series",
}: ComingSoonDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-accent/30">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Coming Soon!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base leading-relaxed mt-4">
            <span className="font-semibold text-foreground">{title}</span> is currently under development and will be available soon.
          </DialogDescription>
          <p className="text-muted-foreground text-sm mt-2">
            Stay tuned for updates! We're working hard to bring you the best learning experience.
          </p>
        </DialogHeader>

        <div className="mt-6">
          <Button
            onClick={onClose}
            variant="hero"
            className="w-full font-bold"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonDialog;
