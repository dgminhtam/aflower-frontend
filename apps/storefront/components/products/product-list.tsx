import { ProductResponse } from "@/lib/definitions"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@workspace/ui/components/button"
import { ShoppingBag, Heart, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductListProps {
    productPage: ProductResponse
    viewMode?: "grid" | "list"
}

export function ProductList({ productPage, viewMode = "grid" }: ProductListProps) {
    const products = productPage.content;

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <svg
                        className="h-10 w-10 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Không tìm thấy sản phẩm</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                    Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
            </div>
        )
    }

    if (viewMode === "list") {
        return (
            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="group flex gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                        {/* Image */}
                        <div className="relative w-32 h-32 sm:w-48 sm:h-48 shrink-0 rounded-md overflow-hidden">
                            <Image
                                src={product.image?.urlMedium || "/placeholder.webp"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {product.price < product.originPrice && (
                                <div className="absolute top-2 left-2 bg-[#A91B38] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    -{Math.round(((product.originPrice - product.price) / product.originPrice) * 100)}%
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <div className="text-[10px] font-bold text-[#A91B38] uppercase tracking-wider mb-1">
                                {product.categories?.[0]?.name || "HOA TƯƠI"}
                            </div>
                            <Link href={`/products/${product.slug}`} className="block mb-2">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#A91B38] transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex items-baseline gap-2 mb-4">
                                {product.price < product.originPrice ? (
                                    <>
                                        <span className="text-sm text-gray-400 line-through font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originPrice)}
                                        </span>
                                        <span className="text-xl font-bold text-[#A91B38]">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-[#A91B38]">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originPrice)}
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto flex gap-2">
                                <Button className="bg-white hover:bg-[#A91B38] text-gray-700 hover:text-white border shadow-sm transition-all">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Thêm vào giỏ
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.originPrice}
                    salePrice={product.price < product.originPrice ? product.price : undefined}
                    image={product.image?.urlMedium || "/placeholder.webp"}
                    category={product.categories?.[0]?.name}
                    className="h-full"
                />
            ))}
        </div>
    )
}
