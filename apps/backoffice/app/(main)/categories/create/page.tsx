import CreateCategoryForm from "@/components/create-category-form";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
export default async function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Tạo danh mục</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
                <CreateCategoryForm />
            </CardContent>
        </Card>
    );
}