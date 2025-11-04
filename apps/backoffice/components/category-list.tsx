import { Category } from "@/app/lib/admin/categories/definitions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import Link from "next/link";
import { DeleteCategoryForm } from "./delete-category-form";
import { Button } from "@workspace/ui/components/button";
import { Edit } from "lucide-react";
import { formatDate } from "@/app/lib/admin/utils";

interface CategoryListProps {
    categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Chỉnh sửa lần cuối</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories?.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell><Link href={`/categories/${category.id}/edit`}>{category.name}</Link></TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell>{formatDate(category.createdDate)}</TableCell>
                            <TableCell>{formatDate(category.lastModifiedDate)}</TableCell>
                            <TableCell className="flex gap-2 justify-end">
                                <Button variant="outline" asChild>
                                    <Link href={`/categories/${category.id}/edit`}><Edit /> Sửa</Link>
                                </Button>
                                <DeleteCategoryForm id={category.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}