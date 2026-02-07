import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewYearBanner from "@/components/NewYearBanner";
import MyFavorites from "@/components/MyFavorites";
import RecentlyViewed from "@/components/RecentlyViewed";
import FolderCards from "@/components/FolderCards";
import WhyPrepProHub from "@/components/WhyPrepProHub";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AdminSection from "@/components/AdminSection";
import FloatingSupportButton from "@/components/FloatingSupportButton";
import SaurabhAI from "@/components/SaurabhAI";
import SaurabhAIWatermark from "@/components/SaurabhAIWatermark";
import ParallaxParticles from "@/components/ParallaxParticles";
import MagneticCursor from "@/components/MagneticCursor";
import AppDownloadBanner from "@/components/AppDownloadBanner";
import Phone3DMockup from "@/components/Phone3DMockup";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useEffect } from "react";

const Index = () => {
  const { isRegistered } = useServiceWorker();
  
  useEffect(() => {
    if (isRegistered) {
      console.log('[App] Service worker ready for offline support');
    }
  }, [isRegistered]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <ParallaxParticles />
        <MagneticCursor />
        
        <NewYearBanner />
        <Header />
        <AppDownloadBanner variant="top" />
        <Hero />
        <MyFavorites />
        <RecentlyViewed />
        <FolderCards />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AboutDeveloper />
        <Phone3DMockup />
        <CTA />
        <AdminSection />
        <Footer />
        <FloatingSupportButton />
        <SaurabhAI />
        <SaurabhAIWatermark />
      </div>
    </PageTransition>
  );
};

export default Index;
