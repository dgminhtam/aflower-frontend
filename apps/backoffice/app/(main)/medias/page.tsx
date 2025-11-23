

import { Suspense } from "react";
import { getMedias } from "@/app/api/medias/action";
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils";
import { MediaList } from "./media-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { MediaFilter } from "./media-filter";
import { MediaUploadDialog } from "./media-upload-dialog";

interface MediaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function Page({ searchParams }: MediaPageProps) {
  return (
    <Card>
      {/* Static Header - Hiển thị ngay lập tức */}
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <CardTitle>Thư viện Media</CardTitle>
            <CardDescription>
              Quản lý toàn bộ hình ảnh và tệp tin đa phương tiện.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <MediaFilter />
            <MediaUploadDialog />
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Loading State */}
      <Suspense fallback={<MediaListSkeleton />}>
        <MediaListContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  );
}

// --- Component Fetch Data ---
async function MediaListContent({
  searchParamsPromise
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise;
  const { page = '1', size = '12', sort = '', ...searchFields } = resolvedParams;

  // Tính toán page index an toàn (tránh số âm)
  const pageIndex = Math.max(0, Number(page) - 1);

  const mediaPage = await getMedias({
    filter: buildFilterQuery(searchFields),
    page: pageIndex,
    size: Number(size),
    sort: buildSortQuery(sort as string),
  });

  return (
    <CardContent className="pt-6">
      <MediaList mediaPage={mediaPage} />
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng Grid Hình ảnh) ---
function MediaListSkeleton() {
  return (
    <CardContent className="pt-6 space-y-6">
      {/* Toolbar (Search + Upload Button) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Skeleton className="h-10 w-full sm:w-[300px]" /> {/* Search Input */}
        <Skeleton className="h-10 w-[140px]" /> {/* Upload Button */}
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Giả lập 10 ô hình ảnh đang load */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Khung hình vuông */}
            <Skeleton className="aspect-square w-full rounded-lg" />
            {/* Tên file và dung lượng */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Skeleton className="h-8 w-20" /> {/* Previous */}
        <Skeleton className="h-8 w-8" />  {/* Page number */}
        <Skeleton className="h-8 w-20" /> {/* Next */}
      </div>
    </CardContent>
  )
}