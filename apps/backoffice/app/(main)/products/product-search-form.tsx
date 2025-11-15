"use client";

import { Category } from "@/app/lib/categories/definitions";
import { Combobox } from "@/components/combobox";
import { MultiSelectCombobox, MultiSelectOption } from "@/components/multiple-select-combobox";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from "react";

interface ProductSearchFormProps {
    categories: Category[];
}

const statuses = [
    {
        value: "PUBLISHED",
        label: "Xuất bản",
    },
    {
        value: "DRAFT",
        label: "Nháp",
    }
]

export function convertCategoriesToMultiSelectOptions(
    categories: Category[] | undefined | null
): MultiSelectOption[] {
    if (!categories || categories.length === 0) {
        return [];
    }
    return categories.map(category => {
        const transformedChildren = convertCategoriesToMultiSelectOptions(category.children);
        const option: MultiSelectOption = {
            value: category.id.toString(),
            label: category.name
        };
        if (transformedChildren && transformedChildren.length > 0) {
            option.children = transformedChildren;
        }
        return option;
    });
}

export function ProductSearchForm({ categories }: ProductSearchFormProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const categoryOptions = convertCategoriesToMultiSelectOptions(categories);

    const defaultName = searchParams.get("name[containsIgnoreCase]") || "";
    const defaultStatus = searchParams.get("status[eq]") || "";
    const defaultCategory = searchParams.get("category.id[in]")?.split(",") || [];

    const [localSearch, setLocalSearch] = useState(defaultName);
    const [localStatus, setLocalStatus] = useState(defaultStatus);
    const [localCategory, setLocalCategory] = useState<string[]>(defaultCategory);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
            params.set("name[containsIgnoreCase]", localSearch.trim());
            params.set("sku[eq]", localSearch.trim());
        } else {
            params.delete("name[containsIgnoreCase]");
            params.delete("sku[eq]");
        }

        if (localStatus) {
            params.set("status[eq]", localStatus);
        } else {
            params.delete("status[eq]");
        }

        if (localCategory.length > 0) {
            params.set("category.id[in]", localCategory.join(","));
        } else {
            params.delete("category.id[in]");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setLocalSearch('');
        setLocalStatus('');
        setLocalCategory([]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("name[containsIgnoreCase]");
        params.delete("sku[eq]");
        params.delete("status[eq]");
        params.delete("category.id[in]");
        params.set("page", "1");
    };

    const showClearButton = localSearch.length > 0 || localStatus.length > 0 || localCategory.length > 0;

    return (
        <Card className="mb-6 border-border bg-card p-4">
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search products by name..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        disabled={isPending}
                        className="pl-10"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Combobox
                        defaultValue={localStatus}
                        options={statuses}
                        onChange={setLocalStatus}
                        label="Trạng thái" />
                    <MultiSelectCombobox
                        options={categoryOptions}
                        value={localCategory}
                        onChange={(value) => {
                            if (typeof value !== 'string') {
                                setLocalCategory(value);
                            }
                        }}
                        placeholder="Tìm kiếm theo danh mục"
                        mode="multiple"
                    />
                    {showClearButton && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            disabled={isPending}
                            size={"lg"}
                        >
                            <X />
                            Clear
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={handleSearchSubmit} disabled={isPending}>
                        {isPending ? <Spinner /> : <Search />} Tìm kiếm
                    </Button>
                </div>
            </div>
        </Card>
    );
}