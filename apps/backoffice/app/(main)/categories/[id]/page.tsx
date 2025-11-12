import { getCategoryById, getCategoryTree, updateCategory } from "@/app/lib/categories/action";
import { UpdateCategoryRequest } from "@/app/lib/categories/definitions";

import UpdateCategoryForm from "@/components/update-category-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

interface UpdateCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

async function handleUpdateCategory(id: number, data: UpdateCategoryRequest) {
  "use server"
  try {
    await updateCategory(id, data);
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    throw error;
  }
}

export default async function UpdateCategoryPage({ params }: UpdateCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);
  const [category, categories] = await Promise.all([
    getCategoryById(categoryId),
    getCategoryTree()
  ]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cập nhật</CardTitle>
        <CardDescription>Chỉnh sửa thông tin</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <UpdateCategoryForm
          categoryId={categoryId}
          initialData={{
            name: category.name,
            description: category.description || "",
            slug: category.slug || "",
            image: category.image,
            active: category.active !== false,
            parentId: category.parentId,
          }}
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
        />
      </CardContent>
    </Card>
  );
}