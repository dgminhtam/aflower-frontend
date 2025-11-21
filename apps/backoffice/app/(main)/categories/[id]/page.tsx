import { getCategoryById, getCategoryTree } from "@/app/api/categories/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";
import UpdateCategoryForm from "./update-category-form";
import { notFound } from "next/navigation"; // Import để xử lý 404

interface UpdateCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: UpdateCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cập nhật</CardTitle>
        <CardDescription>Chỉnh sửa thông tin danh mục</CardDescription>
      </CardHeader>
      <Separator />
      {/* Sử dụng Loading Skeleton được custom riêng cho Form */}
      <Suspense fallback={<UpdateCategorySkeleton />}>
        <FetchData id={categoryId} />
      </Suspense>
    </Card>
  );
}

// --- 1. Tạo Skeleton mô phỏng Form ---
// Cái này giúp UI không bị giật khi data load xong
function UpdateCategorySkeleton() {
  return (
    <CardContent className="space-y-6 pt-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label Tên */}
          <Skeleton className="h-10 w-full" /> {/* Input Tên */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label Slug */}
          <Skeleton className="h-10 w-full" /> {/* Input Slug */}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label Mô tả */}
        <Skeleton className="h-24 w-full" /> {/* Textarea */}
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" /> {/* Button Submit */}
        <Skeleton className="h-10 w-24" /> {/* Button Cancel */}
      </div>
    </CardContent>
  )
}

interface FetchDataCategoryPageProps {
  id: number
}

async function FetchData({ id }: FetchDataCategoryPageProps) {
  // --- 2. Xử lý lỗi (Robustness) ---
  // Nếu fetch lỗi, component này sẽ throw error và được error.tsx bắt
  // Nếu dùng Promise.all mà 1 cái fail thì cả 2 fail, cần lưu ý
  
  try {
      const [category, categories] = await Promise.all([
        getCategoryById(id),
        getCategoryTree()
      ]);

      // Nếu không tìm thấy category (người dùng nhập ID bậy trên URL)
      if (!category) {
        notFound(); 
      }

      return (
        <CardContent>
          <UpdateCategoryForm
            categoryId={id}
            initialData={{
              name: category.name,
              description: category.description || "",
              slug: category.slug || "",
              image: category.image,
              active: category.active !== false,
              parentId: category.parentId,
            }}
            categories={categories}
          />
        </CardContent>
      );
  } catch (error) {
      // Bạn có thể throw error để file error.tsx bắt
      throw error; 
  }
}