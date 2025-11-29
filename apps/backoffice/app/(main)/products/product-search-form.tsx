"use client";

import { Category } from "@/app/lib/categories/definitions";
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils";
import { Combobox } from "@/components/combobox";
import { MultiSelectCombobox } from "@/components/multiple-select-combobox";
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

export function ProductSearchForm({ categories }: ProductSearchFormProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const categoryOptions = convertCategoriesToMultiSelectOptions(categories);

    const SEARCH_KEY = "name[containsIgnoreCase],sku[eq]";
    const defaultName = searchParams.get(SEARCH_KEY) || "";
    const defaultStatus = searchParams.get("status[eq]") || "";
    const defaultCategory = searchParams.get("categories.id[in]")?.split(",") || [];

    const [localSearch, setLocalSearch] = useState(defaultName);
    const [localStatus, setLocalStatus] = useState(defaultStatus);
    const [localCategory, setLocalCategory] = useState<string[]>(defaultCategory);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
            params.set(SEARCH_KEY, localSearch.trim());
            // Remove old keys if they exist
            params.delete("name[containsIgnoreCase]");
            params.delete("sku[eq]");
        } else {
            params.delete(SEARCH_KEY);
            params.delete("name[containsIgnoreCase]");
            params.delete("sku[eq]");
        }

        if (localStatus) {
            params.set("status[eq]", localStatus);
        } else {
            params.delete("status[eq]");
        }

        if (localCategory.length > 0) {
            params.set("categories.id[in]", localCategory.join(","));
        } else {
            params.delete("categories.id[in]");
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
        params.delete(SEARCH_KEY);
        params.delete("name[containsIgnoreCase]");
        params.delete("sku[eq]");
        params.delete("status[eq]");
        params.delete("categories.id[in]");
        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const showClearButton = localSearch.length > 0 || localStatus.length > 0 || localCategory.length > 0;

    return (
        <Card className="mb-6 border-border bg-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 relative">
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

                <div className="md:col-span-2">
                    <Combobox
                        defaultValue={localStatus}
                        options={statuses}
                        onChange={setLocalStatus}
                        label="Trạng thái"
                        className="w-full"
                    />
                </div>
                <div className="md:col-span-3">
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
                        className="w-full"
                    />
                </div>
                <div className="md:col-span-3 flex items-center gap-2">
                    <Button onClick={handleSearchSubmit} disabled={isPending}>
                        {isPending ? <Spinner /> : <Search />} Tìm kiếm
                    </Button>
                    {showClearButton && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            disabled={isPending}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}