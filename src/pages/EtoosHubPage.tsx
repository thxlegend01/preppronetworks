import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EtoosHubPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-background dark:via-background dark:to-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-pink-200 dark:border-border/40 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-pink-100 dark:hover:bg-secondary/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-600 dark:text-primary" />
          <span className="font-bold text-lg text-pink-900 dark:text-foreground">ETOOS INDIA HUB</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-black text-center text-pink-900 dark:text-foreground">
          PrepProHub Lecture Library
        </h1>

        {/* Notice */}
        <div className="flex items-start gap-3 bg-pink-100/80 dark:bg-accent/20 border border-pink-300 dark:border-accent/30 rounded-xl p-4 text-sm text-pink-800 dark:text-foreground">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-pink-600 dark:text-warning" />
          <p>
            <strong>Important:</strong> If any pop-up or promotion appears inside the player, simply ignore it and continue studying. PrepPro Network is always with you.
          </p>
        </div>

        {/* Iframe Container */}
        <div className="rounded-2xl overflow-hidden border border-pink-200 dark:border-border/40 shadow-lg bg-white dark:bg-card">
          <iframe
            src="https://mega.nz/folder/8xIw2J7B#jXph6UjPwqoy6sDrNHQN7A"
            className="w-full border-0"
            style={{ height: "90vh" }}
            title="ETOOS INDIA HUB - Lecture Library"
            allow="autoplay; fullscreen"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-pink-600 dark:text-muted-foreground font-medium pb-4">
          Powered by PrepPro Network
        </p>
      </div>
    </div>
  );
};

export default EtoosHubPage;
