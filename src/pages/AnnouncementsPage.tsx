import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnnouncementSection from "@/components/AnnouncementSection";
import PageTransition from "@/components/PageTransition";

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-2 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <AnnouncementSection />
      </div>
    </PageTransition>
  );
};

export default AnnouncementsPage;
