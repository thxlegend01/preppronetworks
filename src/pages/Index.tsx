import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import NewYearBanner from "@/components/NewYearBanner";
import WhyPrepProHub from "@/components/WhyPrepProHub";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import MyFavorites from "@/components/MyFavorites";
import RecentlyViewed from "@/components/RecentlyViewed";
import Features from "@/components/Features";
import TrustSection from "@/components/TrustSection";
import StudyMaterial from "@/components/StudyMaterial";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AdminSection from "@/components/AdminSection";
import FloatingSupportButton from "@/components/FloatingSupportButton";
import MobileStickyButton from "@/components/MobileStickyButton";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <NewYearBanner />
        <Header />
        <Hero />
        <WhyPrepProHub />
        <WhoIsThisFor />
        {user && <Dashboard />}
        <MyFavorites />
        <RecentlyViewed />
        <Features />
        <TrustSection />
        <StudyMaterial />
        <AboutDeveloper />
        <CTA />
        <AdminSection />
        <Footer />
        <FloatingSupportButton />
        <MobileStickyButton />
      </div>
    </PageTransition>
  );
};

export default Index;
