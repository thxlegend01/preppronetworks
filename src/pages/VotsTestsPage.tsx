import { useState } from "react";
import { ArrowLeft, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import votsLogo from "@/assets/vots-logo.png";

const tests = [
  { id: "vots2-1", title: "VOTS-2: Full Syllabus Test 1", subtitle: "Full Syllabus Test 1", url: "/tests/vots2-1.html" },
  { id: "vots2-2", title: "VOTS-2: Full Syllabus Test 2", subtitle: "Full Syllabus Test 2", url: "/tests/vots2-2.html" },
  { id: "vots2-3", title: "VOTS-2: Full Syllabus Test 3", subtitle: "Full Syllabus Test 3", url: "/tests/vots2-3.html" },
  { id: "vots2-4", title: "VOTS-2: Full Syllabus Test 4", subtitle: "Full Syllabus Test 4", url: "/tests/vots2-4.html" },
  { id: "vots2-5", title: "VOTS-2: Full Syllabus Test 5", subtitle: "Full Syllabus Test 5", url: "/tests/vots2-5.html" },
  { id: "vots2-6", title: "VOTS-2: Full Syllabus Test 6", subtitle: "Full Syllabus Test 6", url: "/tests/vots2-6.html" },
  { id: "vots2-7", title: "VOTS-2: Full Syllabus Test 7", subtitle: "Full Syllabus Test 7", url: "/tests/vots2-7.html" },
];

const VotsTestsPage = () => {
  const navigate = useNavigate();

  const handleStartTest = (test: typeof tests[0]) => {
    navigate(`/view/${encodeURIComponent(test.title)}`, {
      state: { url: test.url, title: test.title, appId: test.id }
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/test-series")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Test Series
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-primary/20">
              <img src={votsLogo} alt="VOTS Logo" className="w-full h-full object-contain bg-white p-1" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              VOTS-2 <span className="text-gradient">Test Series</span>
            </h1>
            <p className="text-lg text-muted-foreground">Full Syllabus Mock Tests for JEE MAINS Preparation</p>
          </motion.div>

          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              >
                <div className="glass-card rounded-2xl p-6 md:p-8 group hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {test.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{test.subtitle} • 90 Questions • 180 mins</p>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    className="w-full text-base py-6"
                    onClick={() => handleStartTest(test)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Test
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-10"
          >
            <div className="glass-card inline-block rounded-xl px-6 py-4">
              <p className="text-muted-foreground">
                <span className="text-primary font-semibold">More tests coming soon!</span> Stay tuned for updates.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VotsTestsPage;
