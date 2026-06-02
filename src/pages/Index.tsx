import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecentlyViewed from "@/components/RecentlyViewed";
import FolderCards from "@/components/FolderCards";
import GlobalSearch from "@/components/GlobalSearch";
import PrepJeePromo from "@/components/PrepJeePromo";
import PartnerMarquee from "@/components/PartnerMarquee";
import WhyPrepProHub from "@/components/WhyPrepProHub";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import AboutDeveloper from "@/components/AboutDeveloper";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AdminSection from "@/components/AdminSection";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <RecentlyViewed />
        <PrepJeePromo />
        <GlobalSearch />
        <FolderCards />
        <PartnerMarquee />
        <WhyPrepProHub />
        <WhoIsThisFor />
        <AboutDeveloper />
        <CTA />
        <AdminSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
