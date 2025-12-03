"use client"

import { ProductCard } from "@/components/ui/product-card"
import { FLASH_SALE_PRODUCTS } from "@/lib/placeholder-data"
import { Button } from "@workspace/ui/components/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { Great_Vibes } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
})

export function SaleSection() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Banner */}
                <div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl bg-[#FDF6F6] flex flex-col items-center justify-center text-center p-6 border border-[#F5E6E6]">
                    {/* Decorative Background Elements (Simulating the flower border) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[url('/home-sale-backgroud.webp')] bg-cover bg-center"></div>
                    <div className="relative z-10 space-y-4">
                        <p className="text-gray-600 font-medium">Giảm tới</p>
                        <h2 className="text-6xl font-bold text-[#A91B38]">20%</h2>
                        <p className={`text-2xl text-[#A91B38] ${greatVibes.className}`}>
                            Đối với các sản phẩm hoa
                        </p>
                        <Button
                            className="bg-[#A91B38] hover:bg-[#8a162e] text-white px-8 py-6 rounded-full text-lg mt-4"
                            asChild
                        >
                            <Link href="/products">
                                Tới cửa hàng
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Product Carousel */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center justify-center">
                        <h2 className={`text-4xl text-[#A91B38] ${greatVibes.className}`}>
                            Giảm giá
                        </h2>
                    </div>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {FLASH_SALE_PRODUCTS.map((product) => (
                                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <ProductCard
                                        id={product.id}
                                        sku={product.sku}
                                        name={product.name}
                                        slug={product.slug}
                                        price={product.price}
                                        salePrice={product.salePrice}
                                        image={product.image}
                                        category="HOA TƯƠI"
                                        className="h-full"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
