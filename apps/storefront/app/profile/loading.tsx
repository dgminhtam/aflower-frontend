import { Skeleton } from "@workspace/ui/components/skeleton";

export default function ProfileLoading() {
    return (
        <div className="space-y-8">
            <div className="flex items-start gap-6 mb-8">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20 mt-2" />
                </div>
            </div>

            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}
