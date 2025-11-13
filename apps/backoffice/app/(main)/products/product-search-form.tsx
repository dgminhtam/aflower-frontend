"use client";

import { Combobox } from "@/components/combobox";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import { Check, Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from "react";

interface ProductSearchFormProps {
    categories: string[];
}

const statuses = [
    {
        value: "PUBLISHED",
        label: "Xuất bản",
    },
    {
        value: "DRAFT",
        label: "Nháp",
    },
]

export function ProductSearchForm({ categories }: ProductSearchFormProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [localSearch, setLocalSearch] = useState(searchParams.get('name') || '');

    const [localStatus, setLocalStatus] = useState(
        searchParams.get('status') || ''
    );

    const [localCategory, setLocalCategory] = useState(
        searchParams.get('category')?.split(',') || []
    );

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch) {
            params.set('name', localSearch);
        } else {
            params.delete('name');
        }

        // 4. CẬP NHẬT LOGIC GỬI PARAM CHO STATUS
        // Nếu localStatus là string (có giá trị), thì set
        // Nếu là string rỗng, thì xóa param
        if (localStatus) {
            params.set('status', localStatus);
        } else {
            params.delete('status');
        }

        // Logic của category giữ nguyên
        if (localCategory.length > 0) {
            params.set('category', localCategory.join(','));
        } else {
            params.delete('category');
        }

        params.set('page', '1');

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // 5. HÀM NÀY GIỜ CHỈ DÀNH CHO CATEGORY
    const toggleLocalCategory = (value: string) => {
        const newFilter = [...localCategory];
        if (newFilter.includes(value)) {
            setLocalCategory(newFilter.filter((v) => v !== value));
        } else {
            newFilter.push(value);
            setLocalCategory(newFilter);
        }
    };

    const clearFilters = () => {
        setLocalSearch('');
        // 6. ĐƯA STATUS VỀ STRING RỖNG KHI CLEAR
        setLocalStatus('');
        setLocalCategory([]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete('name');
        params.delete('status');
        params.delete('category');
        params.set('page', '1');

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Hàm này giờ chỉ dùng cho Category, nhưng vẫn giữ tên chung
    const getFilterDisplay = (filter: string[], defaultText: string) => {
        if (filter.length === 0) return defaultText;
        if (filter.length === 1) return filter[0];
        return `${filter.length} selected`;
    };

    // 7. CẬP NHẬT ĐIỀU KIỆN HIỂN THỊ NÚT CLEAR
    const showClearButton = localSearch.length > 0 || localStatus.length > 0 || localCategory.length > 0;

    return (
        <Card className="mb-6 border-border bg-card p-4">
            <div className="flex flex-col gap-4">
                {/* --- Ô SEARCH INPUT --- */}
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
                        options={statuses}
                        defaultValue={undefined}
                        onChange={setLocalStatus}
                        label="Trạng thái"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 border-border text-foreground bg-transparent"
                                disabled={isPending}
                            >
                                <Filter className="h-4 w-4" />
                                Category: <span className="font-semibold capitalize">{getFilterDisplay(localCategory, 'All')}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {categories.map((category) => (
                                <DropdownMenuItem
                                    key={category}
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => toggleLocalCategory(category)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    {localCategory.includes(category) && <Check className="h-4 w-4" />}
                                    <span className={localCategory.includes(category) ? "font-semibold" : ""}>{category}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* --- NÚT CLEAR --- */}
                    {showClearButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            disabled={isPending}
                            className="text-muted-foreground hover:text-foreground gap-2"
                        >
                            <X className="h-4 w-4" />
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