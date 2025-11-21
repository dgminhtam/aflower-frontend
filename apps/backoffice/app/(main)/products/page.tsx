import { Suspense } from "react";
import { ProductListPage } from "@/app/(main)/products/product-list";
import { getCategoryTree } from "@/app/api/categories/action";
import { getProducts } from "@/app/api/products/action";
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface ProductPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: ProductPageProps) {
  // Lưu ý: searchParams trong Next.js 15 là Promise, cần await ở component cha
  // hoặc truyền xuống component con để xử lý.
  // Ở đây ta truyền promise xuống wrapper để Suspense hoạt động tốt nhất khi params thay đổi.
  
  return (
    <Card>
      {/* Static Header - Hiển thị ngay lập tức */}
      <CardHeader>
        <CardTitle>Quản lý sản phẩm</CardTitle>
        <CardDescription>
          Danh sách, tìm kiếm và quản lý toàn bộ sản phẩm trong hệ thống.
        </CardDescription>
      </CardHeader>
      
      <Separator />

      {/* Loading State */}
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  );
}

// --- Component Fetch Data ---
async function ProductListContent({ 
  searchParamsPromise 
}: { 
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Giải quyết searchParams
  const resolvedParams = await searchParamsPromise;
  const { page = '1', size = '12', sort = '', ...searchFields } = resolvedParams;

  // Tính toán page index an toàn (URL thường là 1-based, API thường là 0-based)
  const pageIndex = Math.max(0, Number(page) - 1);

  // Fetch song song: Sản phẩm & Danh mục (để lọc)
  const [productPage, categoryTree] = await Promise.all([
    getProducts({
      filter: buildFilterQuery(searchFields),
      page: pageIndex,
      size: Number(size),
      sort: buildSortQuery(sort as string),
    }),
    getCategoryTree(),
  ]);

  return (
    <CardContent>
      <ProductListPage productPage={productPage} categories={categoryTree} />
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng Table/Grid Sản phẩm) ---
function ProductListSkeleton() {
  return (
    <CardContent className="pt-6 space-y-6">
      {/* Toolbar (Search + Filter + Add Button) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
           <Skeleton className="h-10 w-full sm:w-[300px]" /> {/* Search Input */}
           <Skeleton className="h-10 w-[100px]" /> {/* Filter Select */}
        </div>
        <Skeleton className="h-10 w-[120px]" /> {/* Add New Button */}
      </div>

      {/* Table Header Skeleton */}
      <div className="border rounded-md">
        <div className="h-10 bg-muted/50 border-b px-4 flex items-center gap-4">
            <Skeleton className="h-4 w-8" /> {/* Checkbox */}
            <Skeleton className="h-4 w-20" /> {/* Column Name */}
            <Skeleton className="h-4 w-20 ml-auto" /> {/* Column Price */}
            <Skeleton className="h-4 w-20 ml-10" /> {/* Column Status */}
            <Skeleton className="h-4 w-10 ml-10" /> {/* Actions */}
        </div>

        {/* Table Rows Skeleton (Giả lập 5 dòng) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 px-4 flex items-center gap-4 border-b last:border-0">
            <Skeleton className="h-4 w-8" /> {/* Checkbox */}
            <Skeleton className="h-10 w-10 rounded-md" /> {/* Product Image */}
            <div className="space-y-2">
                 <Skeleton className="h-4 w-40" /> {/* Product Name */}
                 <Skeleton className="h-3 w-24" /> {/* SKU */}
            </div>
            <Skeleton className="h-4 w-20 ml-auto" /> {/* Price */}
            <Skeleton className="h-6 w-20 rounded-full ml-10" /> {/* Status Badge */}
            <div className="ml-10 flex gap-2">
                <Skeleton className="h-8 w-8" /> {/* Edit Btn */}
                <Skeleton className="h-8 w-8" /> {/* Delete Btn */}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  )
}