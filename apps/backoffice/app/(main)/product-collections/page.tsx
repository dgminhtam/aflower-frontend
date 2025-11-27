import { Suspense } from "react";
import { getProductCollections } from "@/app/api/product-collections/action";
import { CollectionListPage } from "./collection-list";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bộ sưu tập sản phẩm</CardTitle>
                <CardDescription>
                    Quản lý các bộ sưu tập sản phẩm hiển thị trên Storefront.
                </CardDescription>
            </CardHeader>

            <Separator />

            <Suspense fallback={<CollectionListSkeleton />}>
                <CollectionListContent searchParamsPromise={searchParams} />
            </Suspense>
        </Card>
    );
}

async function CollectionListContent({
    searchParamsPromise
}: {
    searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParamsPromise;
    const { page = '1', size = '10', search = '' } = resolvedParams;

    const pageIndex = Math.max(0, Number(page) - 1);

    const collectionPage = await getProductCollections({
        page: String(pageIndex),
        size: String(size),
        search: String(search),
    });

    return (
        <CardContent>
            <CollectionListPage collectionPage={collectionPage} />
        </CardContent>
    );
}

function CollectionListSkeleton() {
    return (
        <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Skeleton className="h-10 w-full sm:w-[300px]" />
                <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </CardContent>
    )
}
