
import { getProducts } from "@/app/api/products/action";
import { ProductListPage } from "@/app/(main)/products/product-list";
import { Separator } from "@workspace/ui/components/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { getCategoryTree } from "@/app/api/categories/action";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams
    const productPage = await getProducts(filters);
    const categoryTree = await getCategoryTree();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
                <CardDescription>Toàn bộ sản phẩm</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <ProductListPage productPage={productPage} categories={categoryTree}/>
            </CardContent>
        </Card>
    );
}
