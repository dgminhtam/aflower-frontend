import { getCategoryById, getCategoryTree } from "@/app/api/categories/action";

import UpdateCategoryForm from "@/app/(main)/categories/[id]/update-category-form";
import {
    CardContent
} from "@workspace/ui/components/card";

interface FetchDataCategoryPageProps {
    id: number
}

export default async function FetchData({ id }: FetchDataCategoryPageProps) {
    const [category, categories] = await Promise.all([
        getCategoryById(id),
        getCategoryTree()
    ]);
    return (
        <CardContent>
            <UpdateCategoryForm
                categoryId={id}
                initialData={{
                    name: category.name,
                    description: category.description || "",
                    slug: category.slug || "",
                    image: category.image,
                    active: category.active !== false,
                    parentId: category.parentId,
                }}
                categories={categories}
            />
        </CardContent>
    );
}