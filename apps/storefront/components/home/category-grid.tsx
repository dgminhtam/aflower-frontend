import { CATEGORIES } from "@/lib/placeholder-data"
import Image from "next/image"
import Link from "next/link"

export function CategoryGrid() {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-serif italic text-primary mb-2">Danh mục</h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group block"
                    >
                        <div className="relative aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-md group-hover:shadow-xl">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <h3 className="text-center font-medium text-lg group-hover:text-primary transition-colors">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    )
}
