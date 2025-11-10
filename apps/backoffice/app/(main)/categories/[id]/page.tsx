import { getCategoryById, getCategoryTree, updateCategory } from "@/app/lib/categories/action"
import { UpdateCategoryRequest } from "@/app/lib/categories/definitions"
import UpdateCategoryForm from "@/components/update-category-form"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

interface UpdateCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

async function handleUpdateCategory(id: number, data: UpdateCategoryRequest) {
  "use server"
  try {
    await updateCategory(id, data)
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error)
    throw error
  }
}

export default async function UpdateCategoryPage({ params }: UpdateCategoryPageProps) {
  const { id } = await params
  const categoryId = Number(id)

  try {
    const [category, categories] = await Promise.all([getCategoryById(categoryId), getCategoryTree()])

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
              parentId: category.parentId ? String(category.parentId) : undefined,
            }}
            categories={categories}
            onUpdateCategory={handleUpdateCategory}
          />
        </CardContent>
      </Card>
    )
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Lỗi</h1>
          <Link href="/admin/categories">
            <Button variant="outline">← Quay lại</Button>
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <p className="font-medium">Không thể tải danh mục. Vui lòng thử lại.</p>
        </div>
      </div>
    )
  }
}
