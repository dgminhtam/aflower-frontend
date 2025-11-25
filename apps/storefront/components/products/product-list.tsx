"use client"

import { ProductResponse } from "@/lib/definitions"
import { ProductCard } from "@/components/ui/product-card"

interface ProductListProps {
    productPage: ProductResponse
}

export function ProductList({ productPage }: ProductListProps) {
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
