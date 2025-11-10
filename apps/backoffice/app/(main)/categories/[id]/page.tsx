import React from "react"; // (Cần cho Suspense, mặc dù loading.tsx tự động)

// Imports cho Actions và Definitions (Giữ nguyên)
import { getCategoryById, getCategoryTree, updateCategory } from "@/app/lib/categories/action";
import { UpdateCategoryRequest, Category, CategoryResponse } from "@/app/lib/categories/definitions";

// Components (Form và Layout)
import UpdateCategoryForm from "@/components/update-category-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

// Định nghĩa kiểu cho props của Page
interface UpdateCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

// Server Action (Giữ nguyên)
async function handleUpdateCategory(id: number, data: UpdateCategoryRequest) {
  "use server"
  try {
    await updateCategory(id, data);
    // (Thêm revalidatePath nếu cần)
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    throw error; // Ném lỗi để form (client) có thể bắt
  }
}

async function CategoryData({ categoryId }: { categoryId: number }) {
  try {
    // 1. Tải dữ liệu
    const [category, categories] = await Promise.all([
      getCategoryById(categoryId), 
      getCategoryTree()
    ]);

    // 2. Render Form (Khi đã có data)
    return (
      <CardContent className="pt-5">
        <UpdateCategoryForm
          categoryId={categoryId}
          initialData={{
            name: category.name,
            description: category.description || "",
            slug: category.slug || "",
            image: category.image,
            active: category.active !== false,
            parentId: category.parentId ? String(category.parentId) : undefined,
          }}
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
        />
      </CardContent>
    );

  } catch (error) {
    // 3. Render Lỗi (Nếu fetch thất bại)
    return (
      <CardContent className="pt-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">Không thể tải chi tiết danh mục.</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      </CardContent>
    );
  }
}


// === PAGE COMPONENT CHÍNH (Chỉ render layout tĩnh) ===
// Page này sẽ render ngay lập tức.
export default async function UpdateCategoryPage({ params }: UpdateCategoryPageProps) {
  // await params (Nếu dùng Next 15+, giữ nguyên)
  const { id } = await params; 
  const categoryId = Number(id);

  // Dòng test 2 giây của bạn (Nếu cần test loading, hãy đặt nó BÊN TRONG <CategoryData />)
  // await new Promise(resolve => setTimeout(resolve, 2000));

  return (
    <Card>
      {/* 1. Phần này render ngay lập tức */}
      <CardHeader>
        <CardTitle>Cập nhật</CardTitle>
        <CardDescription>Chỉnh sửa thông tin</CardDescription>
      </CardHeader>
      <Separator />

      {/* 2. Phần này sẽ kích hoạt 'loading.tsx' (Suspense) 
           vì <CategoryData /> là một Async Component.
      */}
      <CategoryData categoryId={categoryId} />
      
    </Card>
  );
}