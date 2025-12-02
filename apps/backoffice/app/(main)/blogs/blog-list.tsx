"use client"

import { BlogPostListResponse } from "@/app/lib/blogs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { SortSelect } from "@/components/sort-select"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Edit2, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { deleteBlog } from "@/app/api/blogs/action"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"

interface BlogListProps {
    blogPage: Page<BlogPostListResponse>
}

export function BlogListPage({ blogPage }: BlogListProps) {
    const blogs = blogPage.content

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/blogs/create"><Plus /> Tạo bài viết mới</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <SortSelect
                        options={[
                            { label: "Mới nhất", value: "publishedAt_desc" },
                            { label: "Cũ nhất", value: "publishedAt_asc" },
                            { label: "Tiêu đề (A-Z)", value: "title_asc" },
                            { label: "Tiêu đề (Z-A)", value: "title_desc" },
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Card className="border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-foreground font-semibold pl-6">Hình ảnh</TableHead>
                                <TableHead className="text-foreground font-semibold">Tiêu đề</TableHead>
                                <TableHead className="text-center text-foreground font-semibold">Trạng thái</TableHead>
                                <TableHead className="text-center text-foreground font-semibold">Ngày tạo</TableHead>
                                <TableHead className="text-center text-foreground font-semibold">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id} className="border-border hover:bg-muted/50 transition-colors">
                                        <TableCell className="pl-6">
                                            {blog.thumbnail?.url && (
                                                <Image
                                                    src={blog.thumbnail.url}
                                                    alt={blog.title}
                                                    width={50}
                                                    height={50}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            <Link href={`/blogs/${blog.id}`}>
                                                {blog.title}
                                            </Link>
                                            <br />
                                            <span className="text-xs text-muted-foreground truncate max-w-[300px] block">
                                                {blog.shortDescription}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {blog.isVisible ? (
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                                                    <Eye className="mr-1 h-3 w-3" /> Hiển thị
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                                    <EyeOff className="mr-1 h-3 w-3" /> Ẩn
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {blog.createdDate && format(new Date(blog.createdDate), "dd/MM/yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    title="Edit"
                                                >
                                                    <Link href={`/blogs/${blog.id}`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteBlogButton id={blog.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                        Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
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
                        Trang {blogPage.number + 1} trên {blogPage.totalPages} ({blogPage.totalElements} tổng)
                    </span>
                </div>
                <div className="flex gap-2">
                    <AppPagination totalElements={blogPage.totalElements} itemsPerPage={blogPage.size} />
                </div>
            </div>
        </div>
    )
}

function DeleteBlogButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteBlog(id)
                toast.success("Xóa bài viết thành công")
                setOpen(false)
                router.refresh()
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa bài viết")
                console.error(error)
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isPending}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isPending ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
