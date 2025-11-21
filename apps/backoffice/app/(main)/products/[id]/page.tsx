import { getCategoryTree } from "@/app/api/categories/action";
import { getProductById } from "@/app/api/products/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UpdateProductForm } from "./update-product-form";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <Card>
      {/* Static Header - Hiển thị ngay lập tức */}
      <CardHeader>
        <CardTitle>Chỉnh sửa sản phẩm</CardTitle>
        <CardDescription>
          Cập nhật thông tin chi tiết, giá bán và hình ảnh sản phẩm.
        </CardDescription>
      </CardHeader>

      <Separator />

      {/* Loading State */}
      <Suspense fallback={<UpdateProductSkeleton />}>
        <FetchProductData id={productId} />
      </Suspense>
    </Card>
  )
}

// --- Component Fetch Data ---
async function FetchProductData({ id }: { id: number }) {
  // Fetch song song (Parallel Data Fetching) để tiết kiệm thời gian
  const [product, categoryTree] = await Promise.all([
    getProductById(id),
    getCategoryTree()
  ]);

  // Nếu không tìm thấy sản phẩm -> Chuyển trang 404
  if (!product) {
    notFound();
  }

  return (
    <CardContent className="pt-6">
      <UpdateProductForm categories={categoryTree} product={product} />
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng Form Update) ---
// Cấu trúc giống hệt Create Form để UX nhất quán
function UpdateProductSkeleton() {
  return (
    <CardContent className="space-y-8 pt-6">
      {/* Row 1: Tên & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Row 2: Slug */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Row 3: Mô tả */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Row 4: Danh mục & Trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Row 5: Giá bán & Giá gốc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Row 6: Ảnh & Gallery (Có thể đang có ảnh nên Skeleton to hơn chút) */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-40 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      <Separator />

      {/* Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  )
}