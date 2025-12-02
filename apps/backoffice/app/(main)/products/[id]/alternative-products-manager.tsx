"use client";

import { addAlternativeProduct, getProducts, removeAlternativeProduct } from "@/app/api/products/action";
import { Product } from "@/app/lib/products/definitions";
import { Button } from "@workspace/ui/components/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AlternativeProductsManagerProps {
    productId: number;
    initialAlternatives: Product[];
}

export function AlternativeProductsManager({ productId, initialAlternatives }: AlternativeProductsManagerProps) {
    const [alternatives, setAlternatives] = useState<Product[]>(initialAlternatives || []);
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsLoading(true);
                try {
                    // Construct search params manually to bypass type checking if needed or match expected format
                    // Based on product-search-form.tsx, it uses "name[containsIgnoreCase]"
                    const params: any = {
                        "name[containsIgnoreCase]": searchQuery,
                        page: 1,
                        size: 10
                    };
                    const res = await getProducts(params);

                    // Filter out current product and already added alternatives
                    const filtered = res.content.filter(p =>
                        p.id !== productId &&
                        !alternatives.some(alt => alt.id === p.id)
                    );
                    setSearchResults(filtered);
                } catch (error) {
                    console.error("Error searching products:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, productId, alternatives]);

    const handleAdd = async (productToAdd: Product) => {
        try {
            await addAlternativeProduct(productId, productToAdd.id);
            setAlternatives([...alternatives, productToAdd]);
            setOpen(false);
            setSearchQuery("");
            toast.success("Đã thêm sản phẩm thay thế");
        } catch (error) {
            toast.error("Lỗi khi thêm sản phẩm thay thế");
        }
    };

    const handleRemove = async (alternativeId: number) => {
        try {
            await removeAlternativeProduct(productId, alternativeId);
            setAlternatives(alternatives.filter(p => p.id !== alternativeId));
            toast.success("Đã xóa sản phẩm thay thế");
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm thay thế");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Sản phẩm thay thế</h3>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm sản phẩm
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="end">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                            />
                            <CommandList>
                                {isLoading && <div className="py-6 text-center text-sm text-muted-foreground">Đang tìm kiếm...</div>}
                                {!isLoading && searchResults.length === 0 && searchQuery && (
                                    <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                                )}
                                <CommandGroup>
                                    {searchResults.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.id.toString()}
                                            onSelect={() => handleAdd(product)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className="relative h-8 w-8 overflow-hidden rounded border">
                                                <Image
                                                    src={product.image?.urlThumbnail || "/placeholder.png"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate font-medium">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.sku}</p>
                                            </div>
                                            <Plus className="h-4 w-4 opacity-50" />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {alternatives.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    Chưa có sản phẩm thay thế nào.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {alternatives.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 rounded-lg border p-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                                <Image
                                    src={product.image?.urlThumbnail || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="truncate font-medium">{product.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{product.sku}</span>
                                    <span>•</span>
                                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(product.id)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
