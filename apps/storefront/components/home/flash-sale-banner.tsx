"use client"

import { Button } from "@workspace/ui/components/button"
import { Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function FlashSaleBanner() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="relative bg-[#990A2C] rounded-[20px] overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[160px] md:px-12 py-8 md:py-0 gap-8">

                {/* Left: Flash Sale Label */}
                <div className="flex items-center gap-4 z-10">
                    <div className="relative">
                        <Tag className="w-16 h-16 text-[#FFB800] fill-[#FFB800] rotate-90" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#990A2C] rounded-full" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[#FFB800] font-bold text-3xl tracking-wider">FLASH</span>
                        <span className="text-[#FFB800] font-bold text-3xl tracking-wider">SALE</span>
                    </div>
                    <div className="flex items-center ml-4">
                        <span className="text-white font-bold text-6xl">20</span>
                        <div className="flex flex-col justify-center ml-1">
                            <span className="text-[#FFB800] font-bold text-2xl leading-none">%</span>
                            <span className="text-[#FFB800] font-bold text-xl leading-none">OFF</span>
                        </div>
                    </div>
                </div>

                {/* Center: Rose Image */}
                {/* We use absolute positioning on desktop to make it overlap/pop out if needed, or just flex */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 md:-my-10 z-20">
                    <Image
                        src={"/flower_scroll.webp"}
                        alt="Rose"
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Right: Text & CTA */}
                <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
                    <div className="text-white">
                        <h3 className="font-bold text-xl mb-1">Tất cả sản phẩm hoa</h3>
                        <p className="text-white/90 text-sm">
                            Nhập <span className="font-bold text-white">20FIORE</span> trong giỏ hàng để nhận ưu đãi.
                        </p>
                    </div>
                    <Button
                        className="bg-white text-[#990A2C] hover:bg-gray-100 font-bold rounded-full px-8 py-6"
                        asChild
                    >
                        <Link href="/products">
                            TỚI CỬA HÀNG
                        </Link>
                    </Button>
                </div>

                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
            </div>
        </section>
    )
}
