"use client";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@workspace/ui/components/input-group";
import { Spinner } from "@workspace/ui/components/spinner";
import { SearchIcon } from "lucide-react";
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
                    <InputGroup>
                        <InputGroupInput placeholder="Tìm kiếm sản phẩm..." value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit();
                                }
                            }}
                            className="pl-10 h-10" />
                        <InputGroupAddon>
                            {isPending && <Spinner />}
                            {!isPending && <SearchIcon />}
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton variant={"secondary"} onClick={handleSearchSubmit} disabled={isPending}>
                                Tìm kiếm
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
        </div>
    );
}
