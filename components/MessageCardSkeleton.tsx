import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessageCardSkeleton() {
  return (
    <Card className="w-full max-w-2xl hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">

          {/* Header row skeleton: timestamp + delete icon */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <Skeleton className="h-4 w-32 bg-primary/20" /> {/* timestamp */}
            <Skeleton className="h-6 w-6 rounded-md bg-primary/20" /> {/* delete button */}
          </div>

          {/* Message text skeleton */}
          <div className="pt-2 space-y-2">
            <Skeleton className="h-4 w-full bg-primary/20" />
            <Skeleton className="h-4 w-4/5 bg-primary/20" />
            <Skeleton className="h-4 w-2/3 bg-primary/20" />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
