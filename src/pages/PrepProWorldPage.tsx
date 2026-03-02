import { Globe, ArrowLeft, Send, Users, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import prepproLogo from "@/assets/preppro-network-logo.jpg";

const links = [
  {
    title: "PrepPro Network Official Channel",
    description: "Official Telegram channel for updates & announcements",
    url: "https://t.me/+Vaaty3NWsRIzOThl",
    icon: Send,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "PrepPro Network All Channels",
    description: "ALLEN Batches, Books, Notes, Mentorship & more",
    url: "https://t.me/PrepProNetwork",
    icon: Users,
    color: "from-violet-500 to-purple-400",
  },
  {
    title: "Books & Notes Channel (PDF)",
    description: "JEE & NEET books, notes PDFs collection",
    url: "https://t.me/JEEandNEET_PrepPro",
    icon: BookOpen,
    color: "from-emerald-500 to-green-400",
  },
];

const partners = [
  { title: "Edufinic", url: "https://EdufinicStudy.lovable.app", color: "from-orange-500 to-amber-400" },
  { title: "LearnifyExams", url: "https://LearnifyExamss.lovable.app", color: "from-pink-500 to-rose-400" },
];

const PrepProWorldPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 mx-auto mb-6 shadow-2xl"
            >
              <img src={prepproLogo} alt="PrepPro Network" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
              PrepPro <span className="text-gradient">Networks World</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Community, updates, and exclusive content — all in one place
            </p>
          </motion.div>

          {/* Main Links */}
          <div className="flex flex-col gap-5 max-w-2xl mx-auto mb-14">
            {links.map((link, index) => (
              <motion.a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card shine-effect rounded-2xl p-6 flex items-center gap-5 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <link.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </motion.a>
            ))}
          </div>

          {/* Partners */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Co-Partners 🤝
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {partners.map((partner, index) => (
                <motion.a
                  key={partner.title}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card shine-effect rounded-2xl p-6 text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:rotate-6 transition-transform`}>
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{partner.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Visit Platform →</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrepProWorldPage;
