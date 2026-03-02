import { useState } from "react";
import { ArrowLeft, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";

const tests = [
  { id: "qft-1", title: "JEE MAINS TEST 1", subtitle: "QFT 1 - Full Test", url: "/tests/qft-1.html" },
  { id: "qft-2", title: "JEE MAINS TEST 2", subtitle: "QFT 2 - Full Test", url: "/tests/qft-2.html" },
  { id: "qft-3", title: "JEE MAINS TEST 3", subtitle: "QFT 3 - Full Test", url: "/tests/qft-3.html" },
  { id: "qft-4", title: "JEE MAINS TEST 4", subtitle: "QFT 4 - Full Test", url: "/tests/qft-4.html" },
  { id: "qft-5", title: "JEE MAINS TEST 5", subtitle: "QFT 5 - Full Test", url: "/tests/qft-5.html" },
  { id: "qft-6", title: "JEE MAINS TEST 6", subtitle: "QFT 6 - Full Test", url: "/tests/qft-6.html" },
  { id: "qft-7", title: "JEE MAINS TEST 7", subtitle: "QFT 7 - Full Test", url: "/tests/qft-7.html" },
  { id: "qft-8", title: "JEE MAINS TEST 8", subtitle: "QFT 8 - Full Test", url: "/tests/qft-8.html" },
  { id: "qft-9", title: "JEE MAINS TEST 9", subtitle: "QFT 9 - Full Test", url: "/tests/qft-9.html" },
  { id: "qft-10", title: "JEE MAINS TEST 10", subtitle: "QFT 10 - Full Test", url: "/tests/qft-10.html" },
  { id: "qft-11", title: "JEE MAINS TEST 11", subtitle: "QFT 11 - Full Test", url: "/tests/qft-11.html" },
  { id: "qft-12", title: "JEE MAINS TEST 12", subtitle: "QFT 12 - Full Test", url: "/tests/qft-12.html" },
];

const MathangoTestsPage = () => {
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
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Mathango <span className="text-gradient">Test Series</span>
            </h1>
            <p className="text-lg text-muted-foreground">25 Full Length Mock Tests for JEE MAINS Preparation</p>
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

export default MathangoTestsPage;
