"use client"

import { useCart } from "@/components/cart/cart-context"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Heart, Search, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Spinner } from "@workspace/ui/components/spinner"

export interface ProductCardProps {
    id: number
    sku: string
    name: string
    slug: string
    price: number
    salePrice?: number
    image: string
    category?: string
    discount?: number
    className?: string
}

export function ProductCard({
    id,
    sku,
    name,
    slug,
    price,
    salePrice,
    image,
    category = "HOA TƯƠI",
    discount,
    className,
}: ProductCardProps) {
    const { addToCart } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    // Calculate discount if not provided but salePrice exists
    const discountValue = discount || (salePrice ? Math.round(((price - salePrice) / price) * 100) : 0)
    const currentPrice = salePrice || price

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if clicked inside Link (though button is absolute)
        e.stopPropagation()

        setIsAdding(true)
        try {
            await addToCart({
                sku: sku,
                quantity: 1,
                description: "Size: Default"
            })
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className={cn("group bg-transparent", className)}>
            {/* Image Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Discount Badge */}
                {discountValue > 0 && (
                    <div className="absolute top-3 left-3 bg-[#A91B38] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        -{discountValue}%
                    </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {/* Wishlist */}
                    <Button
                        size="icon-lg"
                        variant="secondary"
                        className="rounded-full bg-white hover:bg-white text-gray-700 hover:text-[#A91B38] shadow-sm transition-colors"
                    >
                        <Heart className="h-5 w-5" />
                    </Button>

                    {/* Quick View */}
                    <Link href={`/products/${sku}`}>
                        <Button
                            size="icon-lg"
                            variant="secondary"
                            className="rounded-full bg-white/60 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-[#A91B38] shadow-sm transition-colors"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Add to Cart - Bottom Right */}
                <div className="absolute bottom-3 right-3">
                    <Button
                        size="icon-lg"
                        className="rounded-xl bg-white hover:bg-[#A91B38] text-gray-700 hover:text-white shadow-md transition-all"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <Spinner />
                        ) : (
                            <ShoppingBag />
                        )}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#A91B38] uppercase tracking-wider">
                    {category}
                </div>
                <Link href={`/products/${sku}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#A91B38] transition-colors line-clamp-2">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                    {salePrice && salePrice < price ? (
                        <>
                            <span className="text-sm text-gray-400 line-through font-medium">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                            </span>
                            <span className="text-xl font-bold text-[#A91B38]">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salePrice)}
                            </span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-[#A91B38]">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
