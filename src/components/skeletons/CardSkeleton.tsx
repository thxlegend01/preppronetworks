import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
    {/* Logo skeleton */}
    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
    
    {/* Title skeleton */}
    <Skeleton className="h-7 w-3/4 mx-auto mb-4" />
    
    {/* Description skeleton */}
    <div className="space-y-2 mb-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
    </div>
    
    {/* Button skeletons */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-[18px]" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const MaterialCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 text-center animate-fade-in">
    {/* Icon skeleton */}
    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
    
    {/* Title skeleton */}
    <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
    
    {/* Subtitle skeleton */}
    <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
    
    {/* Button skeletons */}
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded-[18px]" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  </div>
);

export const BatchCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
    {/* Image skeleton */}
    <Skeleton className="h-48 w-full" />
    
    {/* Content */}
    <div className="p-6">
      {/* Title skeleton */}
      <Skeleton className="h-6 w-4/5 mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Button skeletons */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-[18px]" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export const LeaderboardSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-xl">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
);

export const GridSkeleton = ({ count = 6, type = "card" }: { count?: number; type?: "card" | "material" | "batch" }) => {
  const SkeletonComponent = type === "material" ? MaterialCardSkeleton : type === "batch" ? BatchCardSkeleton : CardSkeleton;
  const gridCols = type === "material" 
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  
  return (
    <div className={`grid ${gridCols} gap-8`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <SkeletonComponent />
        </div>
      ))}
    </div>
  );
};
