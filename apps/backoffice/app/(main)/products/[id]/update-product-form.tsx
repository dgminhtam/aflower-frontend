"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Product } from "@/app/lib/products/definitions"

interface EditProductFormProps {
  product: Product | null
  isNew?: boolean
}

const CATEGORIES = ["Electronics", "Furniture", "Accessories"]
const STATUSES = ["active", "inactive", "draft"]

export function EditProductForm({ product, isNew = false }: EditProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Product>(product)

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "price" || field === "originPrice" ? Number.parseFloat(value) : value,
    }))
  }

  const handleAddGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), ""],
    }))
  }

  const handleGalleryImageChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery?.map((img, i) => (i === index ? value : img)) || [],
    }))
  }

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsLoading(false)
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="font-semibold text-foreground mb-6">Product Details</h2>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Product Name *</label>
            <Input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-border"
              required
            />
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category *</label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status *</label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value as any)}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      <span className="capitalize">{status}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">SKU *</label>
            <Input
              type="text"
              placeholder="Enter product SKU"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-border"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <Textarea
              placeholder="Enter product description"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-border min-h-24 resize-none"
            />
          </div>

          {/* Price and Origin Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Price *</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  step="0.01"
                  min="0"
                  className="border-border"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Origin Price</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.originPrice || ""}
                  onChange={(e) => handleChange("originPrice", e.target.value)}
                  step="0.01"
                  min="0"
                  className="border-border"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Product Images</h3>
            <div className="space-y-6">
              {/* Main Product Image */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Main Product Image *</label>
                <div className="flex flex-col gap-4">
                  <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={formData.image || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => handleChange("image", e.target.value)}
                    className="border-border"
                    required
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Image Gallery</label>
                <div className="space-y-3 mb-4">
                  {formData.gallery && formData.gallery.length > 0 ? (
                    formData.gallery.map((galleryImage, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative h-20 w-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={galleryImage || "/placeholder.svg"}
                            alt={`Gallery ${index}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <Input
                            type="text"
                            placeholder={`Gallery image URL ${index + 1}`}
                            value={galleryImage}
                            onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                            className="border-border"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="w-fit gap-2 border-border"
                          >
                            <X className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No gallery images added yet</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGalleryImage}
                  className="w-full gap-2 border-border border-dashed bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add Gallery Image
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full border-border bg-transparent">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isLoading || !formData.name}
          className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  )
}