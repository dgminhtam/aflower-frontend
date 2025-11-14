"use client";

import { Category } from "@/app/lib/categories/definitions";
import { Combobox, ComboboxOption } from "@/components/combobox";
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
    },
    {
        value: "DRAFT1",
        label: "Nháp1",
    },
    {
        value: "DRAFT2",
        label: "Nháp2",
    },
    {
        value: "DRAFT3",
        label: "Nháp",
    }
]

export function convertCategoriesToOptions(categories: Category[]): ComboboxOption[] {
    const allOptions: ComboboxOption[] = [];

    /**
     * Hàm đệ quy để xử lý các cấp danh mục.
     * @param currentCategories - Mảng danh mục ở cấp hiện tại
     * @param prefix - Tiền tố nhãn (ví dụ: "Quần áo >")
     */
    function processCategories(currentCategories: Category[], prefix: string) {
        if (!currentCategories || currentCategories.length === 0) {
            return;
        }

        currentCategories.forEach(category => {
            // Tạo nhãn mới. Nếu có tiền tố, thêm vào.
            // Ví dụ: "" + "Quần áo" -> "Quần áo"
            // Hoặc: "Quần áo" + "Áo Sơ mi" -> "Quần áo > Áo Sơ mi"
            const newLabel = prefix ? `${prefix} > ${category.name}` : category.name;

            // 1. Thêm danh mục hiện tại vào danh sách
            allOptions.push({
                value: category.id.toString(),
                label: newLabel
            });

            // 2. Gọi đệ quy cho các con của nó, với nhãn hiện tại là tiền tố mới
            processCategories(category.children, newLabel);
        });
    }

    // Bắt đầu quá trình với các danh mục gốc (không có tiền tố)
    processCategories(categories, "");

    return allOptions;
}

export function ProductSearchForm({ categories }: ProductSearchFormProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const categoryOptions = convertCategoriesToOptions(categories);
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

        if (localStatus) {
            params.set('status', localStatus);
        } else {
            params.delete('status');
        }

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

    const clearFilters = () => {
        setLocalSearch('');
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
                        options={statuses}
                        defaultValue={undefined}
                        onChange={setLocalStatus}
                        label="Trạng thái"
                    />
                    <MultiSelectCombobox
                        options={categoryOptions}
                        value={undefined}
                        onChange={setLocalCategory}
                        placeholder="Choose frameworks..."
                    />
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