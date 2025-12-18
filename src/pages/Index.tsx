import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TestList from "@/components/TestList";
import TestSchedule from "@/components/TestSchedule";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TestList />
      <TestSchedule />
      <Footer />
    </div>
  );
};

export default Index;
