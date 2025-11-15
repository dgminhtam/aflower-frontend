
import { ProductListPage } from "@/app/(main)/products/product-list";
import { getCategoryTree } from "@/app/api/categories/action";
import { getProducts } from "@/app/api/products/action";
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { page = '0', size = '10', sort = '', ...searchFields } = await searchParams;
    const [productPage, categoryTree] = await Promise.all([
        getProducts({
            filter: buildFilterQuery(searchFields),
            page: Number(page) - 1,
            size: Number(size),
            sort: buildSortQuery(sort),
        }),
        getCategoryTree(),
    ]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
                <CardDescription>Toàn bộ sản phẩm</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <ProductListPage productPage={productPage} categories={categoryTree} />
            </CardContent>
        </Card>
    );
}
