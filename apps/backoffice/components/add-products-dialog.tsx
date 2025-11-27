"use client"

import { addProductsToCollection } from "@/app/api/product-collections/action"
import { getProducts } from "@/app/api/products/action"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Spinner } from "@workspace/ui/components/spinner"
import Image from "next/image"
import * as React from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"

interface AddProductsDialogProps {
    collectionId: number
    existingProductIds: number[]
    onSuccess: (newProducts: any[]) => void
}

export function AddProductsDialog({ collectionId, existingProductIds, onSuccess }: AddProductsDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [products, setProducts] = React.useState<any[]>([])
    const [selectedIds, setSelectedIds] = React.useState<number[]>([])

    const loadProducts = async (searchTerm: string) => {
        setLoading(true)
        try {
            const response = await getProducts({
                page: 0,
                size: 50,
                search: searchTerm,
            })
            // Filter out products that are already in the collection
            const availableProducts = response.content.filter(
                (p: any) => !existingProductIds.includes(p.id)
            )
            setProducts(availableProducts)
        } catch (error) {
            toast.error("Không thể tải danh sách sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebouncedCallback((value: string) => {
        loadProducts(value)
    }, 300)

    React.useEffect(() => {
        if (open) {
            loadProducts("")
        }
    }, [open])

    const handleSearch = (value: string) => {
        setSearch(value)
        debouncedSearch(value)
    }

    const handleToggle = (productId: number) => {
        setSelectedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm")
            return
        }

        setSubmitting(true)
        try {
            await addProductsToCollection(collectionId, selectedIds)

            // Get the newly added products
            const newProducts = products.filter(p => selectedIds.includes(p.id))

            toast.success(`Đã thêm ${selectedIds.length} sản phẩm vào bộ sưu tập`)
            onSuccess(newProducts)
            setSelectedIds([])
            setOpen(false)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Đã có lỗi xảy ra khi thêm sản phẩm")
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Button type="button" onClick={() => setOpen(true)}>
                Thêm sản phẩm
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm vào bộ sưu tập</DialogTitle>
                        <DialogDescription>
                            Chọn các sản phẩm bạn muốn thêm vào bộ sưu tập này.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Spinner />
                                </div>
                            ) : products.length > 0 ? (
                                <div className="space-y-2">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted cursor-pointer"
                                            onClick={() => handleToggle(product.id)}
                                        >
                                            <Checkbox
                                                checked={selectedIds.includes(product.id)}
                                                onCheckedChange={() => handleToggle(product.id)}
                                            />
                                            {product.image?.urlMedium && (
                                                <Image
                                                    src={product.image.urlMedium}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    {search ? "Không tìm thấy sản phẩm nào" : "Không còn sản phẩm nào để thêm"}
                                </p>
                            )}
                        </ScrollArea>

                        <p className="text-sm text-muted-foreground">
                            Đã chọn: {selectedIds.length} sản phẩm
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={submitting || selectedIds.length === 0}>
                            {submitting ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Đang thêm...
                                </>
                            ) : (
                                `Thêm ${selectedIds.length > 0 ? selectedIds.length : ''} sản phẩm`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
