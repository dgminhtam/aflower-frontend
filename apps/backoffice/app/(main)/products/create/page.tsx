import { getCategoryTree } from "@/app/api/categories/action";
import CreateCategoryForm from "@/app/(main)/categories/create/create-category-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { CreateProductForm } from "./create-product-form";

export default async function Page() {
  const categoryTree = await getCategoryTree();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Sản phẩm mới</CardTitle>
        <CardDescription>Thêm một sản phẩm mới vào hệ thống. Hãy điền đầy đủ thông tin bên dưới.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <CreateProductForm categories={categoryTree}/>
      </CardContent>
    </Card>
  )
}
