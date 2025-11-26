"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from "react";

export function ProductFilter() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const defaultName = searchParams.get("name[containsIgnoreCase]") || "";

    const [localSearch, setLocalSearch] = useState(defaultName);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
            params.set("name[containsIgnoreCase]", localSearch.trim());
        } else {
            params.delete("name[containsIgnoreCase]");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setLocalSearch('');

        const params = new URLSearchParams(searchParams.toString());
        params.delete("name[containsIgnoreCase]");
        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const hasActiveFilters = localSearch.length > 0;

    return (
        <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit();
                            }
                        }}
                        className="pl-10 h-10"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                    <Button onClick={handleSearchSubmit} disabled={isPending} size="default" className="h-10">
                        Tìm kiếm
                    </Button>

                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearFilters} disabled={isPending} size="icon" title="Xóa bộ lọc" className="h-10 w-10">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
