"use client"

import type { Category } from "@/app/lib/categories/definitions"
import { Button } from "@workspace/ui/components/button"
import { PlusSquare } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CategoryNode } from "./category-node"

interface CategoryTreeProps {
  categoryTree: Category[]
}

const getAllCategoryIds = (categories: Category[]): number[] => {
  const ids: number[] = []
  const traverse = (cats: Category[]) => {
    cats.forEach((cat) => {
      ids.push(cat.id)
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children)
      }
    })
  }
  traverse(categories)
  return ids
}

export function CategoryTree({ categoryTree }: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const handleExpandAll = () => {
    const allIds = getAllCategoryIds(categoryTree)
    setExpandedIds(new Set(allIds))
  }

  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  const handleToggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <Button onClick={handleExpandAll} variant="outline">
          Expand All
        </Button>
        <Button onClick={handleCollapseAll} variant="outline">
          Collapse All
        </Button>
        <Button asChild>
          <Link href="/categories/create">
            <PlusSquare />
            Thêm mới
          </Link>
        </Button>
      </div>

      <div className="mt-5">
        {categoryTree.map((category) => (
          <CategoryNode
            key={category.id}
            category={category}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  )
}
