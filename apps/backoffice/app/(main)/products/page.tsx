
import { ProductListPage } from "@/components/product-list-page";
import { Separator } from "@radix-ui/react-separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";


export default function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
                <CardDescription>Toàn bộ sản phẩm</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
                <ProductListPage />
            </CardContent>
        </Card>
    );
}
