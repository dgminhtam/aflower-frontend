"use client"

import { ProductResponse } from "@/app/lib/products/definitions"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import {
  ArrowUpDown,
  Check,
  Copy,
  Edit2,
  Eye,
  Filter,
  Grid3x3,
  List,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { AppPagination } from "./app-pagination"

interface ProductListProps {
  productPage: ProductResponse
}

export function ProductListPage({ productPage }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<"name" | "price" | "revenue">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const products = productPage.content;
  const categories = Array.from(new Set(products.map((p) => p.category?.name)))
  const statuses = Array.from(new Set(products.map((p) => p.status)))

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

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
    setCurrentPage(1)
  }

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilter((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
    setCurrentPage(1)
  }

  const handleSort = (field: "name" | "price" | "revenue") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const getFilterDisplay = (items: string[]): string => {
    if (items.length === 0) return "All"
    if (items.length <= 3) {
      return items.join(", ")
    }
    return `${items.slice(0, 2).join(", ")} +${items.length - 2}`
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button>
            <Plus />
            THêm sản phẩm
          </Button>
          <Button variant={"outline"}>
            <Upload />
            Import CSV
          </Button>
        </div>
        <ToggleGroup type="single" variant={"outline"}>
          <ToggleGroupItem value="bold" aria-label="Toggle list" onClick={() => setViewMode("list")}>
            <List /> List
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle grid" onClick={() => setViewMode("grid")}>
            <Grid3x3 /> Grid
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card className="mb-6 border-border bg-card p-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-border text-foreground bg-transparent">
                  <Filter className="h-4 w-4" />
                  Status: <span className="font-semibold">{getFilterDisplay(statusFilter)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className="capitalize flex items-center gap-2"
                  >
                    {statusFilter.includes(status) && <Check className="h-4 w-4" />}
                    <span className={statusFilter.includes(status) ? "font-semibold" : ""}>{status}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-border text-foreground bg-transparent">
                  <Filter className="h-4 w-4" />
                  Category: <span className="font-semibold">{getFilterDisplay(categoryFilter)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => toggleCategoryFilter(category)}
                    className="flex items-center gap-2"
                  >
                    {categoryFilter.includes(category) && <Check className="h-4 w-4" />}
                    <span className={categoryFilter.includes(category) ? "font-semibold" : ""}>{category}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(statusFilter.length > 0 || categoryFilter.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter([])
                  setCategoryFilter([])
                }}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {viewMode === "list" ? (
        // List View
        <div className="space-y-4">
          <Card className="border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Image</TableHead>
                    <TableHead
                      className="text-foreground font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {sortBy === "name" && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">Category</TableHead>
                    <TableHead
                      className="text-right text-foreground font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Price
                        {sortBy === "price" && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="text-center text-foreground font-semibold">Status</TableHead>
                    <TableHead
                      className="text-right text-foreground font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("revenue")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Revenue
                        {sortBy === "revenue" && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="text-center text-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <Image
                            src={product.image?.urlMedium || "/placeholder.webp"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="h-12 w-12 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.category?.name}</TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          ${product.price?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          ${product.price?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
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
            </div>
          </Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Số lượng trên 1 trang:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[8, 12, 40, 80].map((size) => (
                    <DropdownMenuItem key={size} onClick={() => handlePageSizeChange(size)}>
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Trang {productPage.number} trên {productPage.totalPages} ({productPage.totalElements} tổng)
              </span>
            </div>

            <div className="flex gap-2">
              <AppPagination totalElements={productPage.totalElements} itemsPerPage={productPage.size} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow p-4"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-muted rounded-lg">
                    <Image
                      src={product.image?.urlMedium || "/placeholder.webp"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.category?.name}</p>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">${product.price?.toFixed(2)}</span>
                      <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                        {product.status}
                      </Badge>
                    </div>

                    <div className="mb-4 text-sm">
                      <span className="text-muted-foreground">Giá gốc: ${product.originPrice?.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-border text-foreground bg-transparent"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-border text-foreground bg-transparent"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-10 p-0 bg-transparent" title="Duplicate">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 p-0 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card p-12">
              <p className="text-center text-muted-foreground">No products found. Try adjusting your filters.</p>
            </Card>
          )}

          {/* Pagination Controls for Grid View */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[5, 10, 20, 50].map((size) => (
                    <DropdownMenuItem key={size} onClick={() => handlePageSizeChange(size)}>
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
      )}

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{products.length}</p>
        </Card>
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Products</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {products.filter((p) => p.status === "active").length}
          </p>
        </Card>
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
          </p>
        </Card>
      </div>
    </div>
  )
}