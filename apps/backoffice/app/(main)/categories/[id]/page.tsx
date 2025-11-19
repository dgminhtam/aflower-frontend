
import { getCategoryById, getCategoryTree } from "@/app/api/categories/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";
import UpdateCategoryForm from "./update-category-form";

interface UpdateCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: UpdateCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);
  return (
    <Card>
      <CardHeader>
        <CardTitle><h3>Cập nhật</h3></CardTitle>
        <CardDescription>Chỉnh sửa thông tin</CardDescription>
      </CardHeader>
      <Separator />
      <Suspense fallback={<Skeleton />}>
        <FetchData id={categoryId} />
      </Suspense>
    </Card>
  );
}

interface FetchDataCategoryPageProps {
  id: number
}

async function FetchData({ id }: FetchDataCategoryPageProps) {
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