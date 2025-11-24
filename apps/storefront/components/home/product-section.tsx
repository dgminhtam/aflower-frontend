import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

interface Product {
    id: number
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
                        <h2 className="text-3xl font-bold font-serif italic text-primary">{title}</h2>
                        <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary/50 rounded-full" />
                    </div>
                    <Button variant="outline" className="rounded-full hover:bg-primary hover:text-white transition-colors" asChild>
                        <Link href={viewAllLink}>Xem thêm</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-background rounded-xl overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="rounded-full hover:scale-110 transition-transform">
                                        <Heart className="h-5 w-5 text-red-500" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="rounded-full hover:scale-110 transition-transform">
                                        <ShoppingCart className="h-5 w-5 text-primary" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <Link href={`/products/${product.slug}`} className="block">
                                    <h3 className="font-medium text-lg text-foreground mb-2 group-hover:text-primary transition-colors truncate">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-primary font-bold text-lg">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
