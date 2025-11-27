import { getProductCollections } from "@/lib/api";
import { Card, CardContent } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const { page = '1', size = '12' } = resolvedParams;

    const collectionsPage = await getProductCollections({
        page: String(Number(page) - 1),
        size: String(size),
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Bộ sưu tập sản phẩm</h1>

            {collectionsPage.content.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collectionsPage.content.map((collection) => (
                        <Link key={collection.id} href={`/collections/${collection.slug}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative aspect-video">
                                    <Image
                                        src={collection.image?.url || '/placeholder.webp'}
                                        alt={collection.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                                    {collection.description && (
                                        <p className="text-muted-foreground line-clamp-2">
                                            {collection.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">Chưa có bộ sưu tập nào.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
