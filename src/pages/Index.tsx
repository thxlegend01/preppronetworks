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
import SaurabhAI from "@/components/SaurabhAI";
import ParallaxParticles from "@/components/ParallaxParticles";
import MagneticCursor from "@/components/MagneticCursor";
import Phone3DMockup from "@/components/Phone3DMockup";
import AppDownloadBanner from "@/components/AppDownloadBanner";
import AppVsWebComparison from "@/components/AppVsWebComparison";
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
        
        <Hero />
        <AppDownloadBanner variant="top" />
        <MyFavorites />
        <RecentlyViewed />
        <FolderCards />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AppVsWebComparison />
        <AboutDeveloper />
        <Phone3DMockup />
        <AppDownloadBanner variant="bottom" />
        <CTA />
        <AdminSection />
        <Footer />
        <SaurabhAI />
        
      </div>
    </PageTransition>
  );
};

export default Index;
