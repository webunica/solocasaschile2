import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CatalogoSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm h-full flex flex-col rounded-[2.5rem] animate-pulse">
          {/* Image Skeleton */}
          <div className="relative h-56 bg-muted/60" />

          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            {/* Constructora Info Skeleton */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-full rounded-full" />
              <Skeleton className="h-6 w-2/3 rounded-full" />
            </div>

            {/* Specs Grid Skeleton */}
            <div className="grid grid-cols-3 gap-4 border-b border-border/40 pb-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
