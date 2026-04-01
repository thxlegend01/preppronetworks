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
import AppDownloadBanner from "@/components/AppDownloadBanner";
import AppVsWebComparison from "@/components/AppVsWebComparison";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
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
