import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { ProductCard } from "../ui/product-card"

interface Product {
    id: number
    sku: string
    name: string
    slug: string
    price: number
    image: string
}


interface ProductSectionProps {
    title: string
    products: Product[]
    viewAllLink?: string
    background?: "white" | "muted"
}

export function ProductSection({ title, products, viewAllLink = "/products", background = "white" }: ProductSectionProps) {
    return (
        <section className={`py-16 ${background === "muted" ? "bg-muted/30" : "bg-background"}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div className="relative">
                        <h2 className="text-3xl font-bold text-primary">{title}</h2>
                        <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary/50 rounded-full" />
                    </div>
                    <Button variant="outline" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild>
                        <Link href={viewAllLink}>Xem thêm</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            category="HOA TƯƠI" // Mock category for now
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
