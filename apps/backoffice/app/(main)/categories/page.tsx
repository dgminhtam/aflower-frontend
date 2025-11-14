import { getCategoryTree } from "@/app/api/categories/action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { CategoryTree } from "./category-tree";

export default async function Page() {
    const categoryTree = await getCategoryTree();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh mục</CardTitle>
                <CardDescription>Toàn bộ danh mục</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <CategoryTree categoryTree={categoryTree} />
            </CardContent>
        </Card>
    );
}