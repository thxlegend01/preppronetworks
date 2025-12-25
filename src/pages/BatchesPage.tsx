import { useState, useMemo } from "react";
import { Search, Filter, Zap, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BatchCard from "@/components/BatchCard";
import PageTransition from "@/components/PageTransition";
import { BATCHES, CATEGORIES, type Category } from "@/lib/data";

const BatchesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Live" | "Available">("All");

  const filteredBatches = useMemo(() => {
    return BATCHES.filter((batch) => {
      const matchesSearch =
        batch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || batch.category === selectedCategory;
      const matchesStatus = statusFilter === "All" || batch.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, statusFilter]);

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">All Apps & Test Series</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Explore Our <span className="text-gradient">Free Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Access premium educational apps and test series for free. Filter by category and start learning today.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search apps, test series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-3 justify-center mb-4">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "border-border/50 hover:border-primary/50 hover:bg-primary/10"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-3 justify-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {(["All", "Live", "Available"] as const).map((status) => (
                <Badge
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    statusFilter === status
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Batches Grid */}
      <section className="pb-24 relative">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredBatches.length}</span> resources
            </p>
          </div>

          {filteredBatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBatches.map((batch, index) => (
                <BatchCard key={batch.id} batch={batch} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default BatchesPage;
