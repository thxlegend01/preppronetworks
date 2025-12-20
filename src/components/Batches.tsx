import { Clock, Users, Star, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const batches = [
  {
    id: 1,
    title: "JEE Main 2025 Crash Course",
    description: "Intensive 3-month program covering complete JEE Main syllabus with daily live classes and tests.",
    duration: "3 Months",
    students: "500+",
    rating: 4.8,
    price: "₹9,999",
    originalPrice: "₹14,999",
    badge: "Popular",
    badgeVariant: "default" as const,
    target: "JEE",
  },
  {
    id: 2,
    title: "JEE Advanced Foundation",
    description: "Complete foundation course for JEE Advanced with in-depth problem solving and concept building.",
    duration: "6 Months",
    students: "300+",
    rating: 4.9,
    price: "₹19,999",
    originalPrice: "₹29,999",
    badge: "Best Value",
    badgeVariant: "secondary" as const,
    target: "JEE",
  },
  {
    id: 3,
    title: "NEET 2025 Complete",
    description: "Comprehensive NEET preparation with Biology focus, Physics, Chemistry and mock tests.",
    duration: "12 Months",
    students: "800+",
    rating: 4.7,
    price: "₹24,999",
    originalPrice: "₹39,999",
    badge: "New",
    badgeVariant: "outline" as const,
    target: "NEET",
  },
];

const Batches = () => {
  return (
    <section id="batches" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Batches</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Join Our <span className="text-gradient">Premium Batches</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose from our carefully designed batches and start your preparation journey today
          </p>
        </div>
        
        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batches.map((batch, index) => (
            <div 
              key={batch.id}
              className="glass-card card-hover shine-effect rounded-2xl overflow-hidden animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header with badge */}
              <div className="relative p-6 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    variant={batch.badgeVariant}
                    className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                  >
                    {batch.badge}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {batch.target}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {batch.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {batch.description}
                </p>
              </div>
              
              {/* Stats */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary/70" />
                    <span>{batch.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary/70" />
                    <span>{batch.students}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span>{batch.rating}</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-foreground">{batch.price}</span>
                  <span className="text-muted-foreground line-through text-sm">{batch.originalPrice}</span>
                  <Badge variant="secondary" className="text-xs bg-success/20 text-success border-success/30">
                    Save {Math.round(100 - (parseInt(batch.price.replace(/[^\d]/g, '')) / parseInt(batch.originalPrice.replace(/[^\d]/g, '')) * 100))}%
                  </Badge>
                </div>
                
                {/* CTA */}
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group/btn">
                  Enroll Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="border-border/60 hover:bg-secondary/50 hover:border-primary/40 transition-all group"
          >
            View All Batches
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Batches;