import { getBlogBySlug } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) {
        return {
            title: "Bài viết không tồn tại",
        };
    }
    return {
        title: blog.title,
        description: blog.shortDescription,
    };
}

export default async function BlogDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
                <div className="text-gray-500">
                    {blog.publishedAt && format(new Date(blog.publishedAt), "dd/MM/yyyy")}
                </div>
            </div>

            {blog.thumbnail?.url && (
                <div className="relative aspect-video w-full mb-10 rounded-lg overflow-hidden">
                    <Image
                        src={blog.thumbnail.url}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div
                className="prose prose-lg max-w-none prose-img:rounded-lg prose-headings:text-primary"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </div>
    );
}
