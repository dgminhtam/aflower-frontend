"use client"

import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import type { Category } from "@/app/lib/admin/categories/definitions"

interface CategorySelectProps {
  value?: string
  onChange: (value: string) => void
  error?: string
  categories: Category[]
}

interface FlattenedCategory {
  id: number
  name: string
  level: number
}

function flattenCategoryTree(categories: Category[], level = 0): FlattenedCategory[] {
  return categories.flatMap((category) => {
    const flattened: FlattenedCategory[] = [
      {
        id: category.id,
        name: category.name,
        level,
      },
    ]
    if (category.children && category.children.length > 0) {
      flattened.push(...flattenCategoryTree(category.children, level + 1))
    }
    return flattened
  })
}

export function CategorySelect({ value, onChange, error, categories }: CategorySelectProps) {
  const flattenedCategories = flattenCategoryTree(categories)

  return (
    <div className="space-y-2">
      <Label htmlFor="parent-category">Danh mục cha</Label>
      <Select value={value || "no-parent"} onValueChange={onChange}>
        <SelectTrigger id="parent-category" className="w-full">
          <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-parent">
            <span>Không có danh mục cha</span>
          </SelectItem>
          {flattenedCategories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              <span style={{ paddingLeft: `${category.level * 16}px` }}>{category.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
