import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Star, BookOpen, PlayCircle, Radio, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBatchById } from "@/lib/data";

const BatchDetailPage = () => {
  const { batchId } = useParams();
  const batch = getBatchById(batchId || "");

  if (!batch) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Batch Not Found</h1>
          <p className="text-muted-foreground mb-8">The batch you're looking for doesn't exist.</p>
          <Link to="/batches">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Batches
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(
    100 - (parseInt(batch.price.replace(/[^\d]/g, "")) / parseInt(batch.originalPrice.replace(/[^\d]/g, "")) * 100)
  );

  const totalLessons = batch.chapters.reduce((acc, ch) => acc + ch.lessons, 0);
  const totalDuration = batch.chapters.reduce((acc, ch) => acc + parseInt(ch.duration), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <Link
            to="/batches"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image & Info */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <img
                  src={batch.image}
                  alt={batch.title}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className={`${
                      batch.status === "Live"
                        ? "bg-success/20 text-success border-success/30"
                        : "bg-primary/20 text-primary border-primary/30"
                    } flex items-center gap-1.5`}
                  >
                    {batch.status === "Live" ? (
                      <Radio className="w-3 h-3 animate-pulse" />
                    ) : (
                      <PlayCircle className="w-3 h-3" />
                    )}
                    {batch.status}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl text-center">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{batch.duration}</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-semibold">{batch.students}</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <BookOpen className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="font-semibold">{totalLessons}</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <Star className="w-5 h-5 mx-auto mb-2 fill-warning text-warning" />
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-semibold">{batch.rating}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{batch.category}</Badge>
                <Badge
                  variant={batch.badgeVariant}
                  className="bg-primary/20 text-primary border-primary/30"
                >
                  {batch.badge}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                {batch.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {batch.description}
              </p>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-semibold">{batch.instructor}</p>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="glass-card p-6 rounded-2xl mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-black text-foreground">{batch.price}</span>
                  <span className="text-xl text-muted-foreground line-through">{batch.originalPrice}</span>
                  <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                    Save {discount}%
                  </Badge>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Lifetime access to all content</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>{totalLessons} video lessons ({totalDuration}+ hours)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Practice questions & mock tests</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Doubt clearing sessions</span>
                  </li>
                </ul>

                <Button className="w-full py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Course <span className="text-gradient">Curriculum</span>
          </h2>

          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {batch.chapters.map((chapter, index) => (
                <AccordionItem
                  key={chapter.id}
                  value={chapter.id}
                  className="glass-card rounded-xl border-border/50 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chapter.lessons} lessons • {chapter.duration}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="pl-14 space-y-3">
                      {Array.from({ length: Math.min(chapter.lessons, 5) }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm text-muted-foreground"
                        >
                          <PlayCircle className="w-4 h-4 text-primary/70" />
                          <span>Lesson {i + 1}: Introduction to {chapter.title.split(" - ")[1] || chapter.title}</span>
                        </div>
                      ))}
                      {chapter.lessons > 5 && (
                        <p className="text-sm text-primary">+ {chapter.lessons - 5} more lessons</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BatchDetailPage;
