import { getBlogs } from "@/lib/api";
import { SearchParams } from "@/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Pagination } from "@/components/pagination";

export const metadata = {
    title: "Blog - Bài viết",
    description: "Cập nhật tin tức mới nhất từ chúng tôi",
};

export default async function BlogsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const blogs = await getBlogs(searchParams);

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Bài Viết Mới Nhất</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs?.content?.map((blog) => (
                    <Link
                        href={`/blogs/${blog.slug}`}
                        key={blog.id}
                        className="group block rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                    >
                        <div className="relative aspect-video w-full overflow-hidden">
                            {blog.thumbnail?.url ? (
                                <Image
                                    src={blog.thumbnail.url}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-gray-500 mb-2">
                                {blog.publishedAt &&
                                    format(new Date(blog.publishedAt), "dd/MM/yyyy")}
                            </div>
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-3 text-sm">
                                {blog.shortDescription}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {(!blogs?.content || blogs.content.length === 0) && (
                <div className="text-center py-20 text-gray-500">
                    Chưa có bài viết nào.
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <Pagination totalPages={blogs?.totalPages || 0} />
            </div>
        </div>
    );
}
