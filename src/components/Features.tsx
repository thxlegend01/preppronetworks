import { BookOpen, Users, FileText, Video, Trophy, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Platform Batches",
    description: "Join structured batches with live classes, recorded lectures, and personalized mentorship for JEE Main & Advanced.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileText,
    title: "Practice Tests",
    description: "Access comprehensive mock tests, chapter-wise tests, and previous year papers with detailed solutions.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Video,
    title: "Video Lectures",
    description: "High-quality recorded lectures covering complete JEE syllabus with concept clarity and problem-solving.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Connect with fellow aspirants, form study groups, and collaborate on difficult topics together.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Track your progress, compete with peers, and stay motivated with our gamified learning experience.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageCircle,
    title: "Doubt Resolution",
    description: "Get your doubts cleared by expert faculty and senior students within hours.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const Features = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Everything You Need</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem designed to help you succeed in your JEE journey
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
