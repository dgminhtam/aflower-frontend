"use client"

import { getCategoriesTree } from "@/lib/api"
import { Category } from "@/lib/definitions"
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


export function CategoryMenu() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesTree()
                setCategories(data || [])
            } catch (error) {
                console.error("Failed to fetch categories tree:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) {
        return (
            <div className="relative flex items-center gap-1 cursor-pointer py-2">
                <span>SẢN PHẨM</span>
            </div>
        )
    }

    return (
        <div className="group relative flex items-center gap-1 cursor-pointer py-2 h-full">
            <Link href="/products" className="flex items-center gap-1 hover:text-primary transition-colors">
                SẢN PHẨM
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Root Dropdown */}
            <div className="absolute top-full left-0 w-64 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                <div className="py-2">
                    {categories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function CategoryItem({ category }: { category: Category }) {
    const hasChildren = category.children && category.children.length > 0

    return (
        <div className="group/item relative px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center justify-between">
            <Link href={`/categories/${category.slug}`} className="flex-1 block">
                {category.name}
            </Link>
            {hasChildren && <ChevronRight className="h-4 w-4 text-muted-foreground" />}

            {/* Submenu */}
            {hasChildren && (
                <div className="absolute top-0 left-full w-64 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 ml-1 min-w-[200px]">
                    <div className="py-2">
                        {category.children!.map((child) => (
                            <CategoryItem key={child.id} category={child} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
