"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Card } from "@workspace/ui/components/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
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
  X,
} from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "draft"
  revenue: number
  image: string
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    category: "Electronics",
    price: 299.99,
    stock: 45,
    status: "active",
    revenue: 13499.55,
    image: "/wireless-headphones.png",
  },
  {
    id: "2",
    name: "Premium Desk Lamp",
    category: "Furniture",
    price: 89.99,
    stock: 120,
    status: "active",
    revenue: 10798.8,
    image: "/modern-desk-lamp.png",
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    category: "Furniture1",
    price: 449.99,
    stock: 28,
    status: "active",
    revenue: 12599.72,
    image: "/ergonomic-office-chair.png",
  },
  {
    id: "4",
    name: "USB-C Hub 7-in-1",
    category: "Electronics",
    price: 49.99,
    stock: 0,
    status: "inactive",
    revenue: 0,
    image: "/usb-hub.png",
  },
  {
    id: "5",
    name: "Wireless Mouse",
    category: "Electronics1",
    price: 39.99,
    stock: 156,
    status: "active",
    revenue: 6238.44,
    image: "/wireless-mouse.png",
  },
  {
    id: "6",
    name: "Mechanical Keyboard RGB",
    category: "Electronics2",
    price: 149.99,
    stock: 67,
    status: "draft",
    revenue: 10049.33,
    image: "/mechanical-keyboard.png",
  },
]

export function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<"name" | "price" | "revenue">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredProducts = useMemo(() => {
    const filtered = SAMPLE_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(product.status)
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(product.category)

      return matchesSearch && matchesStatus && matchesCategory
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, statusFilter, categoryFilter, sortBy, sortOrder])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredProducts.slice(startIndex, startIndex + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  const categories = Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.category)))
  const statuses = Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.status)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "draft":
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
      {/* Header */}
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


        <ButtonGroup>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List />
            List
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 />
            Grid
          </Button>
        </ButtonGroup>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-border bg-card p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
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
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="h-12 w-12 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.category}</TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          ${product.revenue.toFixed(2)}
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

          {/* Pagination Controls */}
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
                Page {currentPage} of {totalPages} ({filteredProducts.length} total)
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Grid View with Pagination
        <div className="space-y-4">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.category}</p>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
                      <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                        {product.status}
                      </Badge>
                    </div>

                    <div className="mb-4 text-sm">
                      <span className="text-muted-foreground">Revenue: ${product.revenue.toFixed(2)}</span>
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
                Page {currentPage} of {totalPages} ({filteredProducts.length} total)
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{SAMPLE_PRODUCTS.length}</p>
        </Card>
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Products</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {SAMPLE_PRODUCTS.filter((p) => p.status === "active").length}
          </p>
        </Card>
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            ${SAMPLE_PRODUCTS.reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}
          </p>
        </Card>
      </div>
    </div>
  )
}