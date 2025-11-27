"use client"

import { ProductCollectionResponse } from "@/app/lib/product-collections/definitions"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Edit2, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AppPagination } from "../../../components/app-pagination"
import { Input } from "@workspace/ui/components/input"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface CollectionListProps {
    collectionPage: ProductCollectionResponse
}

export function CollectionListPage({ collectionPage }: CollectionListProps) {
    const collections = collectionPage.content;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Input
                        placeholder="Tìm kiếm bộ sưu tập..."
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get('search')?.toString()}
                    />
                </div>
                <Button asChild>
                    <Link href="/product-collections/create" ><Plus /> Tạo bộ sưu tập</Link>
                </Button>
            </div>

            <div className="space-y-4">
                <Card className="border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-foreground font-semibold pl-6">Hình ảnh</TableHead>
                                <TableHead className="text-foreground font-semibold">Tên bộ sưu tập</TableHead>
                                <TableHead className="text-foreground font-semibold">Slug</TableHead>
                                <TableHead className="text-center text-foreground font-semibold">Trạng thái</TableHead>
                                <TableHead className="text-center text-foreground font-semibold">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {collections.length > 0 ? (
                                collections.map((collection) => (
                                    <TableRow key={collection.id} className="border-border hover:bg-muted/50 transition-colors">
                                        <TableCell className="pl-6">
                                            <Image
                                                src={collection.image?.url || "/placeholder.webp"}
                                                alt={collection.name}
                                                width={50}
                                                height={50}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            <Link href={`/product-collections/${collection.id}`}>
                                                {collection.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {collection.slug}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className={collection.status === 'ACTIVE' ? "bg-green-500/10 text-green-700" : "bg-gray-500/10 text-gray-700"}>
                                                {collection.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    title="Edit"
                                                >
                                                    <Link href={`/product-collections/${collection.id}`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                        Không tìm thấy bộ sưu tập nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4">
                <AppSelectPageSize />

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Trang {collectionPage.number + 1} trên {collectionPage.totalPages} ({collectionPage.totalElements} tổng)
                    </span>
                </div>
                <div className="flex gap-2">
                    <AppPagination totalElements={collectionPage.totalElements} itemsPerPage={collectionPage.size} />
                </div>
            </div>
        </div>
    )
}
