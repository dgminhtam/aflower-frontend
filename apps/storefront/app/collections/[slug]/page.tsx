import { getProductCollectionBySlug } from "@/lib/api";

import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/ui/product-card";
import { Card, CardContent } from "@workspace/ui/components/card";
import Image from "next/image";

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const collection = await getProductCollectionBySlug(slug);

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Collection Banner */}
                {collection.image && (
                    <div className="relative w-full h-64 md:h-96">
                        <Image
                            src={collection.image.url}
                            alt={collection.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="container mx-auto px-4 text-center text-white">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.name}</h1>
                                {collection.description && (
                                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                                        {collection.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 py-12">
                    {!collection.image && (
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{collection.name}</h1>
                            {collection.description && (
                                <p className="text-muted-foreground text-lg">
                                    {collection.description}
                                </p>
                            )}
                        </div>
                    )}

                    <h2 className="text-2xl font-bold mb-6">
                        Sản phẩm trong bộ sưu tập ({collection.products.length})
                    </h2>

                    {collection.products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {collection.products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    sku={product.sku}
                                    name={product.name}
                                    slug={product.slug}
                                    price={product.price}
                                    salePrice={product.originPrice > product.price ? product.price : undefined} // Assuming price is sale price if lower than origin
                                    // Note: API might return different fields. Let's check Product type if possible, but for now map common fields.
                                    // Actually, looking at ProductDetail, product.price seems to be the current price.
                                    // And originPrice is the original price.
                                    // ProductCard expects 'price' as original/regular price and 'salePrice' as discounted price?
                                    // Let's re-read ProductCard logic:
                                    // const discountValue = discount || (salePrice ? Math.round(((price - salePrice) / price) * 100) : 0)
                                    // const currentPrice = salePrice || price
                                    // So 'price' is the base price (originPrice), and 'salePrice' is the actual selling price (price) IF it's lower.
                                    // Wait, usually 'price' in DB is selling price.
                                    // Let's look at ProductDetail again:
                                    // {new Intl.NumberFormat("vi-VN", ...).format(product.price)}
                                    // {product.originPrice > product.price && ... format(product.originPrice)}
                                    // So product.price is the CURRENT selling price. product.originPrice is the higher original price.
                                    // ProductCard logic:
                                    // if salePrice < price -> show salePrice (big) and price (crossed out).
                                    // So we should pass:
                                    // price={product.originPrice || product.price}
                                    // salePrice={product.originPrice > product.price ? product.price : undefined}
                                    image={product.image?.urlMedium || product.image?.url || "/placeholder.png"}
                                    category={product.category?.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground">
                                    Bộ sưu tập này chưa có sản phẩm nào.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const collection = await getProductCollectionBySlug(slug);

    return {
        title: `${collection.metaTitle || collection.name} | AFlower`,
        description: collection.metaDescription || collection.description || `Khám phá bộ sưu tập ${collection.name}`,
        keywords: collection.metaKeywords,
    };
}
