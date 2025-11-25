import { getRootCategories } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

export async function CategoryGrid() {
    const categories = await getRootCategories();

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif font-medium text-primary mb-2">Categories</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group flex flex-col items-center"
                    >
                        <div className="relative w-64 h-64 mb-4 flex items-center justify-center">
                            {/* Background Shape */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/category-shape.webp"
                                    alt="shape"
                                    fill
                                    className="object-contain opacity-80"
                                />
                            </div>

                            {/* Category Image */}
                            <div className="relative z-10 w-60 h-60 transition-transform duration-500 group-hover:-translate-y-2">
                                {category.image ? (
                                    <Image
                                        src={category.image.urlMedium || category.image.url}
                                        alt={category.name}
                                        fill
                                        className="object-contain drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-center font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    )
}
