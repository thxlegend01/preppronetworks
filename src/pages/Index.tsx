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

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <NewYearBanner />
        <Header />
        <Hero />
        <MyFavorites />
        <RecentlyViewed />
        <Features />
        <StudyMaterial />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AboutDeveloper />
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
