"use client";

import { Category } from "@/lib/definitions";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Slider } from "@workspace/ui/components/slider";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface ProductSidebarProps {
    categories: Category[];
}

export function ProductSidebar({ categories }: ProductSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const selectedCategories = searchParams.get("categories.id[in]")?.split(",") || [];
    const minPriceParam = searchParams.get("price[gte]") || "";
    const maxPriceParam = searchParams.get("price[lte]") || "";

    const [minPrice, setMinPrice] = useState(minPriceParam);
    const [maxPrice, setMaxPrice] = useState(maxPriceParam);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const MAX_PRICE = 10000000;

    // Update local state when URL params change
    useEffect(() => {
        const min = minPriceParam ? Number(minPriceParam) : 0;
        const max = maxPriceParam ? Number(maxPriceParam) : MAX_PRICE;
        setPriceRange([min, max]);
        setMinPrice(minPriceParam);
        setMaxPrice(maxPriceParam);
    }, [minPriceParam, maxPriceParam]);

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        let currentSelected = [...selectedCategories];

        if (checked) {
            if (!currentSelected.includes(categoryId)) {
                currentSelected.push(categoryId);
            }
        } else {
            currentSelected = currentSelected.filter((id) => id !== categoryId);
        }

        if (currentSelected.length > 0) {
            params.set("categories.id[in]", currentSelected.join(","));
        } else {
            params.delete("categories.id[in]");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handlePriceSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) {
            params.set("price[gte]", minPrice);
        } else {
            params.delete("price[gte]");
        }

        if (maxPrice) {
            params.set("price[lte]", maxPrice);
        } else {
            params.delete("price[lte]");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleSliderChange = (value: number[]) => {
        setPriceRange(value);
        setMinPrice(value[0].toString());
        setMaxPrice(value[1].toString());
    };

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                            isPending={isPending}
                        />
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Khoảng giá</h3>
                <div className="space-y-6">
                    <Slider
                        defaultValue={[0, MAX_PRICE]}
                        value={priceRange}
                        max={MAX_PRICE}
                        step={100000}
                        minStepsBetweenThumbs={1}
                        onValueChange={handleSliderChange}
                        className="py-4"
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Từ"
                            value={minPrice}
                            onChange={(e) => {
                                setMinPrice(e.target.value);
                                setPriceRange([Number(e.target.value), priceRange[1] ? priceRange[1] : 0]);
                            }}
                            className="h-9"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Đến"
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(e.target.value);
                                setPriceRange([priceRange[1] ? priceRange[1] : 0, Number(e.target.value)]);
                            }}
                            className="h-9"
                        />
                    </div>
                    <Button
                        onClick={handlePriceSubmit}
                        disabled={isPending}
                        className="w-full"
                        size="sm"
                    >
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface CategoryTreeItemProps {
    category: Category;
    selectedCategories: string[];
    onCategoryChange: (categoryId: string, checked: boolean) => void;
    isPending: boolean;
    level?: number;
}

function CategoryTreeItem({
    category,
    selectedCategories,
    onCategoryChange,
    isPending,
    level = 0
}: CategoryTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategories.includes(category.id.toString());

    return (
        <div className="select-none">
            <div
                className="flex items-center space-x-2 py-1"
                style={{ paddingLeft: `${level * 12}px` }}
            >
                {hasChildren ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-0.5 hover:bg-muted rounded-sm text-muted-foreground"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : (
                    <div className="w-5" /> // Spacer for alignment
                )}

                <Checkbox
                    id={`category-${category.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                        onCategoryChange(category.id.toString(), checked as boolean)
                    }
                    disabled={isPending}
                />
                <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                    {category.name}
                </Label>
            </div>

            {hasChildren && isExpanded && (
                <div className="mt-1">
                    {category.children!.map((child) => (
                        <CategoryTreeItem
                            key={child.id}
                            category={child}
                            selectedCategories={selectedCategories}
                            onCategoryChange={onCategoryChange}
                            isPending={isPending}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
