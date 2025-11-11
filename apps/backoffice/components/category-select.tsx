"use client"

import type { Category } from "@/app/lib/categories/definitions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useMemo } from "react";

interface CategorySelectProps {
  value?: number | undefined
  onChange: (value: number | undefined) => void
  error?: string
  categories: Category[]
  categoryIdToDisable?: number
}

interface FlattenedCategory {
  id: number
  name: string
  level: number
}

function flattenCategoryTree(
  categories: Category[],
  level = 0,
): FlattenedCategory[] {
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

export function CategorySelect({
  value,
  onChange,
  error,
  categories,
  categoryIdToDisable,
}: CategorySelectProps) {
  const flattenedCategories = useMemo(
    () => flattenCategoryTree(categories),
    [categories],
  )

  const disabledIds = useMemo(() => {
    const disabledSet = new Set<number>()
    if (!categoryIdToDisable) {
      return disabledSet
    }
    const categoryToDisableIndex = flattenedCategories.findIndex(
      (c) => c.id === categoryIdToDisable,
    )

    if (categoryToDisableIndex === -1) {
      disabledSet.add(categoryIdToDisable)
      return disabledSet
    }

    const categoryToDisable = flattenedCategories[categoryToDisableIndex]
    const levelToDisable = categoryToDisable?.level

    disabledSet.add(categoryToDisable ? categoryToDisable.id : -1)
    for (
      let i = categoryToDisableIndex + 1;
      i < flattenedCategories.length;
      i++
    ) {
      const category = flattenedCategories[i]
      if (category && levelToDisable && category.level > levelToDisable) {
        disabledSet.add(category.id)
      } else {
        break
      }
    }

    return disabledSet
  }, [flattenedCategories, categoryIdToDisable])

  const handleValueChange = (internalValue: string) => {
    if (internalValue === "no-parent") {
      onChange(undefined)
    } else {
      onChange(Number(internalValue))
    }
  }

  const internalValue = value !== undefined ? String(value) : "no-parent"

  return (
    <div className="space-y-2">
      <Select value={internalValue} onValueChange={handleValueChange}>
        <SelectTrigger id="parent-category" className="w-full">
          <SelectValue placeholder="Chọn danh mục cha (tùy chọn)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-parent">
            <span>Không có danh mục cha</span>
          </SelectItem>
          {flattenedCategories.map((category) => (
            <SelectItem
              key={category.id}
              value={String(category.id)}
              disabled={disabledIds.has(category.id)}
            >
              <span style={{ paddingLeft: `${category.level * 16}px` }}>
                {category.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}