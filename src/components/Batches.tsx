import { Clock, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    badgeColor: "bg-primary",
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
    badgeColor: "bg-success",
  },
  {
    id: 3,
    title: "Class 11 Complete Package",
    description: "Start early with our comprehensive Class 11 program designed for future JEE aspirants.",
    duration: "12 Months",
    students: "800+",
    rating: 4.7,
    price: "₹24,999",
    originalPrice: "₹39,999",
    badge: "New",
    badgeColor: "bg-accent",
  },
];

const Batches = () => {
  return (
    <section className="py-20 relative bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            Featured Batches
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Join Our Premium Batches</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed batches and start your preparation journey today
          </p>
        </div>
        
        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batches.map((batch, index) => (
            <Card 
              key={batch.id}
              className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              <div className="relative">
                <Badge className={`absolute top-4 right-4 ${batch.badgeColor}`}>
                  {batch.badge}
                </Badge>
              </div>
              
              <CardHeader className="pt-8">
                <CardTitle className="text-xl">{batch.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {batch.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{batch.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{batch.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span>{batch.rating}</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">{batch.price}</span>
                  <span className="text-muted-foreground line-through">{batch.originalPrice}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full" size="lg">
                  Enroll Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Batches
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Batches;
