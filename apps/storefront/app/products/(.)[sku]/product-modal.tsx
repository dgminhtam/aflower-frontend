"use client";

import { ProductDetail } from "@/components/products/product-detail";
import { Product } from "@/lib/definitions";
import { Drawer, DrawerContent, DrawerTitle } from "@workspace/ui/components/drawer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductModal({ product }: { product: Product }) {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (!val) {
            router.back();
        }
    };

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent className="max-h-[90vh] overflow-y-auto">
                <div className="sr-only">
                    <DrawerTitle>{product.name}</DrawerTitle>
                </div>
                <div className="container mx-auto px-4 py-6">
                    <ProductDetail product={product} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
