import { Skeleton } from '@workspace/ui/components/skeleton';

export default function Loading() {
    return (
        <div className="grid grid-cols-4 gap-4" aria-label="Đang tải nội dung trang">
            <div className="flex flex-col space-y-6">
                <Skeleton className="h-48 w-full rounded-xl sm:h-40" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-3/4 rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-1/2 rounded-md sm:h-5" />
                </div>
            </div>
            <div className="flex flex-col space-y-6">
                <Skeleton className="h-48 w-full rounded-xl sm:h-40" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-3/4 rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-1/2 rounded-md sm:h-5" />
                </div>
            </div>
            <div className="flex flex-col space-y-6">
                <Skeleton className="h-48 w-full rounded-xl sm:h-40" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-3/4 rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-1/2 rounded-md sm:h-5" />
                </div>
            </div>
            <div className="flex flex-col space-y-6">
                <Skeleton className="h-48 w-full rounded-xl sm:h-40" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-3/4 rounded-md sm:h-5" />
                    <Skeleton className="h-6 w-1/2 rounded-md sm:h-5" />
                </div>
            </div>
        </div>
    );
}