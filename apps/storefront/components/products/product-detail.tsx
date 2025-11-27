"use client";

import { useCart } from "@/components/cart/cart-context";

import { Product } from "@/lib/definitions";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailProps {
    product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState(product.image?.urlLarge || "/placeholder.png");
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        setQuantity(value);
    };

    const { addToCart, isLoading } = useCart();

    const handleAddToCart = async () => {
        await addToCart({
            sku: product.sku,
            quantity: quantity,
            description: `Size: Default` // Placeholder description
        });
    };

    const handleBuyNow = () => {
        // Placeholder logic
        console.log("Buy now:", { product, quantity });
        alert("Chức năng Mua ngay đang được phát triển!");
    };

    // Combine main image and gallery for thumbnails
    const images = [product.image, ...(product.gallery || [])].filter(Boolean);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-background">
                    <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(img.urlLarge)}
                                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${selectedImage === img.urlLarge
                                    ? "border-primary ring-2 ring-primary ring-offset-2"
                                    : "border-transparent hover:border-muted-foreground"
                                    }`}
                            >
                                <Image
                                    src={img.urlMedium}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Product Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {product.name}
                    </h1>
                    <div className="mt-4 flex items-end gap-4">
                        <p className="text-3xl font-bold text-primary">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product.price)}
                        </p>
                        {product.originPrice > product.price && (
                            <p className="text-xl text-muted-foreground line-through mb-1">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product.originPrice)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="prose prose-sm text-muted-foreground">
                    <p>{product.description}</p>
                </div>

                <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Số lượng:</span>
                        <div className="flex items-center rounded-md border">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none rounded-l-md"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                className="h-9 w-14 rounded-none border-0 text-center focus-visible:ring-0"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none rounded-r-md"
                                onClick={() => handleQuantityChange(quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="flex-1 gap-2 text-base"
                            onClick={handleAddToCart}
                            disabled={isLoading}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Thêm vào giỏ hàng
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 text-base border-primary text-primary hover:bg-primary/10"
                            onClick={handleBuyNow}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>

                {/* Additional Info / Policies */}
                <div className="grid grid-cols-1 gap-4 pt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Giao hàng miễn phí cho đơn hàng trên 500k</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Đổi trả trong vòng 24h nếu hoa hư hỏng</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Tặng kèm thiệp chúc mừng</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
