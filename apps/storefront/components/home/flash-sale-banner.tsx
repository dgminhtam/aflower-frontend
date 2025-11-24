"use client"

import { Button } from "@workspace/ui/components/button"
import { FLASH_SALE_PRODUCTS } from "@/lib/placeholder-data"
import { Timer } from "lucide-react"
import { ProductCard } from "../ui/product-card"

export function FlashSaleBanner() {
    return (
        <section className="py-16 bg-gradient-to-r from-red-500 to-pink-600 text-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white text-red-600 p-2 rounded-lg shadow-lg rotate-[-5deg]">
                            <span className="text-2xl font-black uppercase">Flash Sale</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Timer className="h-5 w-5 animate-pulse" />
                            <span className="font-mono font-bold text-xl">02 : 15 : 45</span>
                        </div>
                    </div>
                    <Button variant="secondary" className="rounded-full px-6 font-semibold shadow-lg hover:scale-105 transition-transform">
                        Xem tất cả
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FLASH_SALE_PRODUCTS.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl p-3 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <ProductCard
                                {...product}
                                category="FLASH SALE"
                                className="h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
