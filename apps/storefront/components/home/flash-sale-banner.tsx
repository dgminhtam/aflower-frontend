"use client"

import { Button } from "@workspace/ui/components/button"
import { FLASH_SALE_PRODUCTS } from "@/lib/placeholder-data"
import { Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg group hover:-translate-y-1 transition-transform duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                                    -{product.discount}%
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 truncate mb-2">{product.name}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-red-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </span>
                                </div>
                                <Button className="w-full mt-4 rounded-full bg-red-600 hover:bg-red-700 text-white">
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
