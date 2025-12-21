import { Clock, Users, Star, ArrowRight, PlayCircle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Batch } from "@/lib/data";

interface BatchCardProps {
  batch: Batch;
  index?: number;
}

const BatchCard = ({ batch, index = 0 }: BatchCardProps) => {
  const discount = Math.round(
    100 - (parseInt(batch.price.replace(/[^\d]/g, "")) / parseInt(batch.originalPrice.replace(/[^\d]/g, "")) * 100)
  );

  return (
    <div
      className="glass-card card-hover shine-effect rounded-2xl overflow-hidden animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={batch.image}
          alt={batch.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Status Badge */}
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
        
        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {batch.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant={batch.badgeVariant}
            className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
          >
            {batch.badge}
          </Badge>
        </div>

        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {batch.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {batch.description}
        </p>

        {/* Instructor */}
        <p className="text-xs text-muted-foreground mb-4">
          by <span className="text-primary/80">{batch.instructor}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
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
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-2xl font-bold text-foreground">{batch.price}</span>
          <span className="text-muted-foreground line-through text-sm">{batch.originalPrice}</span>
          <Badge variant="secondary" className="text-xs bg-success/20 text-success border-success/30">
            Save {discount}%
          </Badge>
        </div>

        {/* CTA */}
        <Link to={`/batches/${batch.id}`}>
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group/btn">
            View Details
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BatchCard;
