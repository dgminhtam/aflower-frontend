import EditCategoryForm from "@/components/edit-category-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

export default async function Page(props: { params: Promise<{ id: number }> }) {
    const params = await props.params;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Sửa danh mục</CardTitle>
                <CardDescription>Sửa thông tin danh mục</CardDescription>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
                {/* <EditCategoryForm category={category} /> */}
            </CardContent>
        </Card>
    );
}