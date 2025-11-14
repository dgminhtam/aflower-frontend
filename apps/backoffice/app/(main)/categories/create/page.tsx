import { getCategoryTree } from "@/app/api/categories/action";
import CreateCategoryForm from "@/components/create-category-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default async function Page() {
  const categories = await getCategoryTree();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo danh mục mới</CardTitle>
        <CardDescription>Thêm một danh mục mới vào hệ thống. Hãy điền đầy đủ thông tin bên dưới.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <CreateCategoryForm categories={categories}/>
      </CardContent>
    </Card>
  )
}
