import { Skeleton } from '@/components/ui/skeleton'

export function PlayerSkeletonList({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>

          <div className="space-y-2 pt-2 border-t border-border/40">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>

          <div className="pt-2">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
