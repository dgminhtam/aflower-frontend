import { Suspense } from "react";
import { BlogListPage } from "@/app/(main)/blogs/blog-list";
import { getBlogs } from "@/app/api/blogs/action";
import { buildSortQuery } from "@/app/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: BlogPageProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quản lý bài viết</CardTitle>
                <CardDescription>
                    Danh sách, tìm kiếm và quản lý toàn bộ bài viết trong hệ thống.
                </CardDescription>
            </CardHeader>

            <Separator />

            <Suspense fallback={<BlogListSkeleton />}>
                <BlogListContent searchParamsPromise={searchParams} />
            </Suspense>
        </Card>
    );
}

async function BlogListContent({
    searchParamsPromise
}: {
    searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParamsPromise;
    const { page = '1', size = '12', sort = '' } = resolvedParams;

    const pageIndex = Math.max(0, Number(page) - 1);

    const blogPage = await getBlogs({
        filter: "",
        page: pageIndex,
        size: Number(size),
        sort: buildSortQuery(sort as string),
    });

    return (
        <CardContent>
            <BlogListPage blogPage={blogPage} />
        </CardContent>
    );
}

function BlogListSkeleton() {
    return (
        <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="h-10 w-[160px]" />
                </div>
                <Skeleton className="h-10 w-[200px]" />
            </div>

            <div className="border rounded-md">
                <div className="h-10 bg-muted/50 border-b px-4 flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32 ml-auto" />
                    <Skeleton className="h-4 w-20 ml-10" />
                    <Skeleton className="h-4 w-20 ml-10" />
                    <Skeleton className="h-4 w-16 ml-10" />
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 px-4 flex items-center gap-4 border-b last:border-0">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-60" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full ml-auto" />
                        <Skeleton className="h-4 w-28 ml-10" />
                        <div className="ml-10 flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </CardContent>
    )
}
