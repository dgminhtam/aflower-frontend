import { Suspense } from "react";
import { getCategoryTree } from "@/app/api/categories/action";
import { CreateProductForm } from "./create-product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Page() {
  return (
    <Card>
      {/* Static Header - Hiển thị ngay lập tức */}
      <CardHeader>
        <CardTitle>Tạo Sản phẩm mới</CardTitle>
        <CardDescription>
          Điền thông tin chi tiết để thêm sản phẩm mới vào kho hàng.
        </CardDescription>
      </CardHeader>
      
      <Separator />

      {/* Loading State với Form Skeleton chi tiết */}
      <Suspense fallback={<CreateProductSkeleton />}>
        <FetchDataForm />
      </Suspense>
    </Card>
  )
}

// --- Component Fetch Data ---
async function FetchDataForm() {
  // Fetch danh mục để fill vào combobox "Danh mục"
  const categoryTree = await getCategoryTree();
  
  return (
    <CardContent className="pt-6">
      <CreateProductForm categories={categoryTree}/>
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng Form Sản phẩm) ---
function CreateProductSkeleton() {
  return (
    <CardContent className="space-y-8 pt-6">
      {/* Row 1: Tên & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label Tên */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" /> {/* Label SKU */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
      </div>

      {/* Row 2: Slug */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label Slug */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Row 3: Mô tả */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label Mô tả */}
        <Skeleton className="h-32 w-full" /> {/* Textarea lớn hơn chút */}
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

      {/* Row 6: Ảnh đại diện (Image Upload) */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-40 w-40 rounded-lg" /> {/* Khung ảnh vuông */}
      </div>

      {/* Row 7: Gallery (Product Gallery) */}
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
        <Skeleton className="h-10 w-32" /> {/* Button Submit */}
        <Skeleton className="h-10 w-24" /> {/* Button Cancel */}
      </div>
    </CardContent>
  )
}