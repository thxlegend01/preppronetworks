import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import MyFavorites from "@/components/MyFavorites";
import RecentlyViewed from "@/components/RecentlyViewed";
import Features from "@/components/Features";
import StudyMaterial from "@/components/StudyMaterial";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        {user && <Dashboard />}
        <MyFavorites />
        <RecentlyViewed />
        <Features />
        <StudyMaterial />
        <AboutDeveloper />
        <CTA />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
