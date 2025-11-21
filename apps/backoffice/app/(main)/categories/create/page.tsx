import { Suspense } from "react";
import { getCategoryTree } from "@/app/api/categories/action";
import CreateCategoryForm from "@/app/(main)/categories/create/create-category-form";
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
      {/* Header hiển thị ngay lập tức (Static Shell) */}
      <CardHeader>
        <CardTitle>Tạo danh mục mới</CardTitle>
        <CardDescription>
          Thêm một danh mục mới vào hệ thống. Hãy điền đầy đủ thông tin bên dưới.
        </CardDescription>
      </CardHeader>
      
      <Separator />

      {/* Phần Form sẽ hiển thị Skeleton trong lúc chờ fetch danh mục cha */}
      <Suspense fallback={<CreateCategorySkeleton />}>
        <FetchDataForm />
      </Suspense>
    </Card>
  );
}

// --- Component Fetch Data (Server Component) ---
async function FetchDataForm() {
  // Fetch dữ liệu cây danh mục để dùng cho dropdown "Danh mục cha"
  const categories = await getCategoryTree();

  return (
    <CardContent>
      <CreateCategoryForm categories={categories} />
    </CardContent>
  );
}

// --- Component Skeleton (Mô phỏng giao diện Form) ---
function CreateCategorySkeleton() {
  return (
    <CardContent className="space-y-8 pt-6">
      {/* Tên & Slug */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label Tên */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label Slug */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
      </div>

      {/* Danh mục cha */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label Parent */}
        <Skeleton className="h-10 w-full" /> {/* Select */}
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label Mô tả */}
        <Skeleton className="h-24 w-full" /> {/* Textarea */}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" /> {/* Button Submit */}
        <Skeleton className="h-10 w-24" /> {/* Button Cancel */}
      </div>
    </CardContent>
  );
}