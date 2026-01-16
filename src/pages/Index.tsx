import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewYearBanner from "@/components/NewYearBanner";
import MyFavorites from "@/components/MyFavorites";
import RecentlyViewed from "@/components/RecentlyViewed";
import Features from "@/components/Features";
import StudyMaterial from "@/components/StudyMaterial";
import WhyPrepProHub from "@/components/WhyPrepProHub";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AdminSection from "@/components/AdminSection";
import FloatingSupportButton from "@/components/FloatingSupportButton";
import SaurabhAI from "@/components/SaurabhAI";
import ParallaxParticles from "@/components/ParallaxParticles";
import MagneticCursor from "@/components/MagneticCursor";
import AppDownloadBanner from "@/components/AppDownloadBanner";
import Phone3DMockup from "@/components/Phone3DMockup";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        {/* Global Effects */}
        <ParallaxParticles />
        <MagneticCursor />
        
        <NewYearBanner />
        <Header />
        
        {/* Top App Download Banner */}
        <AppDownloadBanner variant="top" />
        
        <Hero />
        <MyFavorites />
        <RecentlyViewed />
        <Features />
        <StudyMaterial />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AboutDeveloper />
        
        {/* 3D Phone Mockup Section */}
        <Phone3DMockup />
        
        <CTA />
        <AdminSection />
        <Footer />
        <FloatingSupportButton />
        <SaurabhAI />
      </div>
    </PageTransition>
  );
};

export default Index;
