import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh mục</CardTitle>
        <CardDescription>Toàn bộ danh mục</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}