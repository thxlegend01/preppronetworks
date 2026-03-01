import { useState } from "react";
import { Globe, ArrowLeft, Sparkles, Heart, Users, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import ComingSoonDialog from "@/components/ComingSoonDialog";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const features = [
  { icon: Users, title: "Community", description: "Connect with fellow aspirants", color: "from-pink-500 to-rose-400" },
  { icon: Bell, title: "Announcements", description: "Latest updates & news", color: "from-violet-500 to-purple-400" },
  { icon: MessageCircle, title: "Discussions", description: "Ask doubts & share tips", color: "from-cyan-500 to-blue-400" },
  { icon: Heart, title: "Exclusive Content", description: "Members-only resources", color: "from-orange-500 to-amber-400" },
];

const PrepProWorldPage = () => {
  const navigate = useNavigate();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">PrepPro Networks World</span>
            </div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 mx-auto mb-6 shadow-2xl"
            >
              <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              PrepPro <span className="text-gradient">Networks World</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Our universe of learning — community, updates, and exclusive content all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setComingSoonOpen(true)}
                className="cursor-pointer"
              >
                <div className="glass-card shine-effect rounded-2xl p-8 text-center group h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto border border-primary/20">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-foreground mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground text-sm">
                We're building something amazing. PrepPro Networks World will be your one-stop hub for everything — stay tuned! 🚀
              </p>
            </div>
          </motion.div>
        </div>

        <ComingSoonDialog isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)} title="PrepPro Networks World" />
      </div>
    </PageTransition>
  );
};

export default PrepProWorldPage;
