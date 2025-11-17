
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";
import FetchData from "./fetch-data";

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