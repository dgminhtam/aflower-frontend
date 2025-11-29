"use client"

import { ProductFilter } from "@/components/products/product-filter"
import { ProductList } from "@/components/products/product-list"
import { ProductSidebar } from "@/components/products/product-sidebar"
import { SortSelect } from "@/components/sort-select"
import { StorefrontPagination } from "@/components/ui/pagination"
import { Category, ProductResponse } from "@/lib/definitions"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { cn } from "@workspace/ui/lib/utils"
import { Grid, List } from "lucide-react"
import { useState } from "react"

interface ProductPageContentProps {
    productPage: ProductResponse
    categories: Category[]
}

export function ProductPageContent({ productPage, categories }: ProductPageContentProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
                <ProductSidebar categories={categories} />
            </aside>
            <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                    <ProductFilter />
                    <div className="flex items-center gap-2">
                        <SortSelect
                            options={[
                                { label: "Tên (A-Z)", value: "name_asc" },
                                { label: "Tên (Z-A)", value: "name_desc" },
                                { label: "Giá (Thấp - Cao)", value: "price_asc" },
                                { label: "Giá (Cao - Thấp)", value: "price_desc" },
                                { label: "Mới nhất", value: "lastModifiedDate_desc" },
                                { label: "Cũ nhất", value: "lastModifiedDate_asc" },
                            ]}
                        />
                        <ButtonGroup aria-label="Button group">
                            <Button variant="outline"
                                size={"icon"}
                                className={cn("rounded-none rounded-l-md w-10", viewMode === "grid" && "bg-muted")}
                                onClick={() => setViewMode("grid")}><Grid /></Button>
                            <Button variant="outline"
                                size={"icon"}
                                className={cn("rounded-none rounded-r-md w-10", viewMode === "list" && "bg-muted")}
                                onClick={() => setViewMode("list")}><List /></Button>
                        </ButtonGroup>
                    </div>
                </div>
                <ProductList productPage={productPage} viewMode={viewMode} />

                <div className="mt-8 flex justify-center">
                    <StorefrontPagination
                        totalElements={productPage.totalElements}
                        itemsPerPage={productPage.size}
                    />
                </div>
            </div>
        </div>
    )
}
