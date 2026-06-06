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
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <PageTransition>
      <SEO
        title="PrepPro Network — Free JEE, NEET, NDA & CDS Prep Apps, Tests & Study Material"
        description="India's #1 free aggregator for JEE, NEET, NDA & CDS aspirants. Access PW, Allen, Unacademy, Mathongo & VOTS test series, study material, batches and a live study tracker — all in one place."
        path="/"
        keywords="JEE preparation, NEET coaching, NDA preparation, CDS coaching, free study apps, mathongo tests, VOTS test series, study tracker, PrepPro Network"
      />
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
