import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import InfinityFeatured from "@/components/InfinityFeatured";
import SEO from "@/components/SEO";

const InfinityPage = () => (
  <main className="min-h-screen bg-background">
    <SEO title="PrepPro Infinity | Free Study Apps" description="Study with PrepPro Mission Jeet, Next Topper, Physics Wallah and Vibrant Academy in PrepPro Infinity." path="/PrepInfinity" />
    <Header />
    <div className="container mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6">
      <Button asChild variant="ghost" className="gap-2">
        <Link to="/apps"><ArrowLeft className="h-4 w-4" />Study Apps</Link>
      </Button>
      <InfinityFeatured standalone />
    </div>
  </main>
);

export default InfinityPage;