
import { getProducts } from "@/app/api/products/action";
import { ProductListPage } from "@/app/(main)/products/product-list";
import { Separator } from "@workspace/ui/components/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams
    const productPage = await getProducts(filters);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
                <CardDescription>Toàn bộ sản phẩm</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <ProductListPage productPage={productPage}/>
            </CardContent>
        </Card>
    );
}
