import { CategoryTree } from "@/components/category-tree";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator"
import { getCategoryTree } from '@/app/lib/admin/categories/data';

export default async function Page() {
    const categoryTree = await getCategoryTree();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh mục</CardTitle>
                <CardDescription>Toàn bộ danh mục</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
                <CategoryTree categoryTree={categoryTree} />
            </CardContent>
        </Card>
    );
}