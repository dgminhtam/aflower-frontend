import { Suspense } from "react";
import { getCategoryTree } from "@/app/api/categories/action";
import { CategoryTree } from "./category-tree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CategoryImportDialog } from "./category-import-dialog";

export default function Page() {
  return (
    <Card>
      {/* Static Header - Hiển thị ngay lập tức */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh mục</CardTitle>
            <CardDescription>Quản lý toàn bộ cấu trúc danh mục sản phẩm</CardDescription>
          </div>
          <CategoryImportDialog />
        </div>
      </CardHeader>

      <Separator />

      {/* Loading State với Skeleton Tree */}
      <Suspense fallback={<CategoryTreeSkeleton />}>
        <FetchCategoryTree />
      </Suspense>
    </Card>
  );
}

// --- Component Fetch Data ---
async function FetchCategoryTree() {
  const categoryTree = await getCategoryTree();

  return (
    <CardContent>
      <CategoryTree categoryTree={categoryTree} />
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng Tree UI) ---
function CategoryTreeSkeleton() {
  return (
    <CardContent className="pt-6 space-y-4">
      {/* Giả lập Search bar hoặc Filter toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-sm" /> {/* Search input */}
        <Skeleton className="h-10 w-24" /> {/* Filter button */}
      </div>

      {/* Giả lập các dòng trong cây danh mục */}
      <div className="space-y-3">
        {/* Parent Item 1 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" /> {/* Expand Icon */}
          <Skeleton className="h-6 w-48" /> {/* Category Name */}
          <Skeleton className="h-6 w-16 ml-auto" /> {/* Action Button */}
        </div>

        {/* Parent Item 2 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-6 w-16 ml-auto" />
        </div>

        {/* Child Item 2.1 (Thụt đầu dòng để giống Tree) */}
        <div className="flex items-center gap-3 pl-8">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-16 ml-auto" />
        </div>

        {/* Child Item 2.2 */}
        <div className="flex items-center gap-3 pl-8">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16 ml-auto" />
        </div>

        {/* Parent Item 3 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-16 ml-auto" />
        </div>
      </div>
    </CardContent>
  )
}