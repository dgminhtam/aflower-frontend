import { getProductById } from "@/app/api/products/action";
import { EditProductForm } from "./update-product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(Number(id));

  return(
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa sản phẩm</CardTitle>
        <CardDescription>Sửa thông tin sản phẩm</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <EditProductForm product={product}/>
      </CardContent>
    </Card>
  )
}
