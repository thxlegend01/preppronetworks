import { BookOpen, Users, FileText, Video, Trophy, MessageCircle } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Platform Batches",
    description: "Join structured batches with live classes, recorded lectures, and personalized mentorship for all competitive exams.",
  },
  {
    icon: FileText,
    title: "Practice Tests",
    description: "Access comprehensive mock tests, chapter-wise tests, and previous year papers with detailed analytics.",
  },
  {
    icon: Video,
    title: "Video Lectures",
    description: "High-quality recorded lectures covering complete syllabus with concept clarity and problem-solving.",
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Connect with fellow aspirants, form study groups, and collaborate on difficult topics together.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Track your progress, compete with peers, and stay motivated with our gamified learning experience.",
  },
  {
    icon: MessageCircle,
    title: "Doubt Resolution",
    description: "Get your doubts cleared by expert faculty and senior students within hours.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Everything You <span className="text-gradient">Need</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A complete ecosystem designed to help you succeed in your competitive exam journey
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card card-hover shine-effect rounded-2xl p-8 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;