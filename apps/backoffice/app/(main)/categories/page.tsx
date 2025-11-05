import { CategoryList } from "@/components/category-list";
import { SearchCategoryForm } from "@/components/search-category-form";
import { AppPagination } from "@/components/app-pagination";
import { SelectSort } from "@/components/app-select-sort";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { Option } from "@/app/lib/admin/definitions";
import { getCategories } from '@/app/lib/admin/categories/data';

const sortOptions: Option[] = [
  { label: 'A-Z', value: 'name_asc' },
  { label: 'Z-A', value: 'name_desc' },
  { label: 'Ngày tạo', value: 'createdDate_asc' },
  { label: 'Ngày cập nhật', value: 'lastModifiedDate_desc' }
];

export default async function Page({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    
    const searchParams = await searchParamsPromise;
    const { page = '0', size = '10', sort = '', ...searchFields } = searchParams;
    const categoriesPage = await getCategories(searchParams);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Danh mục</CardTitle>
                <CardDescription>Toàn bộ danh mục</CardDescription>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
                <div className="flex justify-end gap-4">
                    <SearchCategoryForm />
                    <SelectSort sortOptions={sortOptions}/>
                    <Button asChild>
                        <Link href="/categories/create"><PlusSquare />Thêm mới</Link>
                    </Button>
                </div>
                <Separator className="my-4" />
                <CategoryList categories={categoriesPage.content} />
            </CardContent>
            <CardFooter>
                <AppPagination itemsPerPage={Number(size)} totalElements={categoriesPage.totalElements} />
            </CardFooter>
        </Card>
    );
}