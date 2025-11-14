"use client"

import { Category } from "@/app/lib/categories/definitions"
import { ProductResponse } from "@/app/lib/products/definitions"
import { formatCurrency } from "@/app/lib/utils"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import {
  Edit2,
  Grid,
  Grid3x3,
  List,
  Plus,
  Trash2,
  Upload
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AppPagination } from "../../../components/app-pagination"
import { ProductCard } from "./product-card"
import { ProductSearchForm } from "./product-search-form"

interface ProductListProps {
  productPage: ProductResponse
  categories: Category[]
}

export function ProductListPage({ productPage, categories }: ProductListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const products = productPage.content;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "DRAFT":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      default:
        return ""
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button>
            <Plus />
            Tạo sản phẩm mới
          </Button>
          <Button variant={"outline"}>
            <Upload />
            Nhập từ file CSV
          </Button>
        </div>
        <ToggleGroup type="single" variant={"outline"}>
          <ToggleGroupItem value="bold" aria-label="Toggle list" onClick={() => setViewMode("list")}>
            <List /> List
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle grid" onClick={() => setViewMode("grid")}>
            <Grid /> Grid
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ProductSearchForm categories={categories} />
      {viewMode === "list" ? (
        <div className="space-y-4">
          <Card className="border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-semibold pl-6">Hình ảnh</TableHead>
                  <TableHead className="text-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      Mã và Tên
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">Danh mục</TableHead>
                  <TableHead className="text-right text-foreground font-semibold">
                    <div className="flex items-center justify-end gap-2">
                      Giá
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-foreground font-semibold">
                    <div className="flex items-center justify-end gap-2">
                      Giá gốc
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-center text-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="pl-6">
                        <Image
                          src={product.image?.urlMedium || "/placeholder.webp"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <Link href={`/products/${product.id}`}>
                          {product.sku}
                        </Link>
                        <br></br>
                        <span>
                          {product.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge variant={"outline"}>{product.category?.name}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-foreground font-semibold">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="text-right text-foreground font-semibold">
                        {formatCurrency(product.originPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      No products found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card p-12">
              <p className="text-center text-muted-foreground">No products found. Try adjusting your filters.</p>
            </Card>
          )}


        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4">
        <AppSelectPageSize />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Trang {productPage.number + 1} trên {productPage.totalPages} ({productPage.totalElements} tổng)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination totalElements={productPage.totalElements} itemsPerPage={productPage.size} />
        </div>
      </div>
    </div>
  )
}