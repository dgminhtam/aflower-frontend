"use client"

import { Button } from "@workspace/ui/components/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { HERO_SLIDES } from "@/lib/placeholder-data"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"

export function HeroSection() {
    return (
        <section className="relative">
            <Carousel
                className="w-full"
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                <CarouselContent>
                    {HERO_SLIDES.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute inset-0 flex items-center justify-center text-center">
                                    <div className="container px-4">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif italic drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                            {slide.title}
                                        </h1>
                                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                            {slide.subtitle}
                                        </p>
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 animate-in fade-in zoom-in duration-1000 delay-300"
                                        >
                                            <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </section>
    )
}
