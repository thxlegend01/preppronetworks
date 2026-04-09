import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecentlyViewed from "@/components/RecentlyViewed";
import FolderCards from "@/components/FolderCards";
import AnnouncementSection from "@/components/AnnouncementSection";
import WhyPrepProHub from "@/components/WhyPrepProHub";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AdminSection from "@/components/AdminSection";
import SaurabhAI from "@/components/SaurabhAI";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <RecentlyViewed />
        <AnnouncementSection />
        <FolderCards />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AboutDeveloper />
        <CTA />
        <AdminSection />
        <Footer />
        <SaurabhAI />
      </div>
    </PageTransition>
  );
};

export default Index;
