import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 space-y-4">
        {/* Form field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Category tree selector skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-2 pl-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>

        {/* Form field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Submit button skeleton */}
        <Skeleton className="h-10 w-32 mt-6" />
      </CardContent>
    </Card>
  )
}