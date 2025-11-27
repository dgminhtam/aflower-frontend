"use client";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@workspace/ui/components/sheet";
import { Progress } from "@workspace/ui/components/progress";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CartSheet() {
    const { cart, isOpen, setIsOpen, updateQuantity, removeItem, isLoading } = useCart();
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleQuantityChange = async (entryId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingId(entryId);
        try {
            await updateQuantity(entryId, newQuantity);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (entryId: number) => {
        setUpdatingId(entryId);
        try {
            await removeItem(entryId);
        } finally {
            setUpdatingId(null);
        }
    };

    const FREE_SHIPPING_THRESHOLD = 500000;
    const currentTotal = cart?.subTotal || 0;
    const progress = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remainingForFreeShip = Math.max(FREE_SHIPPING_THRESHOLD - currentTotal, 0);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
                <div className="px-4 pt-6 pb-3 border-b">
                    <SheetTitle className="flex items-center gap-2 text-lg mb-3">
                        <ShoppingBag className="h-5 w-5" />
                        Giỏ hàng
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                            {cart?.totalItems || 0}
                        </span>
                    </SheetTitle>

                    {cart?.entries && cart.entries.length > 0 && (
                        <div className="space-y-2 bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <Truck className="h-3.5 w-3.5 text-green-600 dark:text-green-500 shrink-0" />
                                {remainingForFreeShip > 0 ? (
                                    <span className="text-[11px] text-green-700 dark:text-green-400">
                                        Mua thêm <span className="font-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(remainingForFreeShip)}</span> để <span className="font-bold">Freeship</span>
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-green-700 dark:text-green-400 font-medium">✓ Bạn được Freeship!</span>
                                )}
                            </div>
                            <Progress value={progress} className="h-1" />
                        </div>
                    )}
                </div>

                {cart?.entries && cart.entries.length > 0 ? (
                    <>
                        <ScrollArea className="flex-1 h-100">
                            <div className="flex flex-col gap-3 p-4">
                                {cart.entries.map((item) => (
                                    <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0">
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.imageUrl || "/placeholder.webp"}
                                                alt={item.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="flex gap-2 items-start justify-between">
                                                <Link
                                                    href={`/products/${item.sku}`}
                                                    className="text-sm font-medium hover:text-primary transition-colors line-clamp-2 leading-tight flex-1"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 hover:bg-transparent text-muted-foreground hover:text-destructive shrink-0"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={updatingId === item.id}
                                                >
                                                    {updatingId === item.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            </div>

                                            {item.description && (
                                                <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-bold text-primary">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(item.price)}
                                                </span>

                                                <div className="flex items-center rounded-md border h-7 bg-background">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-none hover:bg-muted p-0"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={updatingId === item.id || item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <div className="h-7 w-8 flex items-center justify-center border-x text-xs font-medium">
                                                        {updatingId === item.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-none hover:bg-muted p-0"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        disabled={updatingId === item.id}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t px-4 py-4 space-y-3 bg-muted/20">
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tạm tính</span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(cart.subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển</span>
                                    <span className="font-medium text-green-600">
                                        {remainingForFreeShip <= 0 ? "Miễn phí" : "Tính sau"}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-baseline pt-1">
                                    <span className="font-bold">Tổng cộng</span>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-primary">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(cart.grandTotal)}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">(Đã bao gồm VAT)</div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-11 rounded-lg font-medium shadow-sm"
                                disabled={isLoading}
                            >
                                Thanh toán ngay
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 px-4">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl" />
                            <div className="relative bg-muted/50 p-6 rounded-full border">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-1 text-center">
                            <h3 className="text-lg font-bold">Giỏ hàng trống</h3>
                            <p className="text-sm text-muted-foreground max-w-[200px]">
                                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full px-6"
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
