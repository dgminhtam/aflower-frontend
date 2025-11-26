"use client";

import { getProducts } from "@/lib/api";
import { Product } from "@/lib/definitions";
import { Input } from "@workspace/ui/components/input";
import { Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

export function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm] = useDebounce(searchTerm, 300);
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!debouncedTerm.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await getProducts({
                    "name[contains]": debouncedTerm,
                    page: "1",
                    size: "5"
                });
                setResults(data?.content || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Error searching products:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim()) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setResults([]);
        setIsOpen(false);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        // Placeholder for Add to Cart logic
        console.log("Add to cart:", product);
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-10 h-12 text-base rounded-full bg-muted/50 border-none focus-visible:ring-1 shadow-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => {
                        if (searchTerm.trim()) setIsOpen(true);
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {isOpen && (searchTerm.trim() !== "") && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border bg-popover text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden">
                    {isLoading ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            Đang tìm kiếm...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto py-2">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-background shrink-0">
                                        <Image
                                            src={product.image?.urlMedium || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-muted-foreground font-semibold">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(product.price)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="shrink-0 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
                                        title="Thêm vào giỏ hàng"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                </Link>
                            ))}
                            <div className="border-t mt-2 pt-2 px-2 pb-2">
                                <Link
                                    href={`/products?name[contains]=${searchTerm}`}
                                    className="block w-full rounded-lg px-2 py-2.5 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Xem tất cả kết quả cho "{searchTerm}"
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
