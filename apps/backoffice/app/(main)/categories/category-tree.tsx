"use client"

import type { Category } from "@/app/lib/categories/definitions";
import { Button } from "@workspace/ui/components/button";
import { ListTree, Minimize2, PlusSquare } from "lucide-react"; // Thêm icon cho đẹp
import Link from "next/link";
import { useCallback, useState } from "react";
import { CategoryNode } from "./category-node";

interface CategoryTreeProps {
  categoryTree: Category[]
}

// Helper tách ra ngoài component để tránh tạo lại mỗi lần render
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
  // Set initial state là rỗng (đóng hết)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const handleExpandAll = () => {
    const allIds = getAllCategoryIds(categoryTree)
    setExpandedIds(new Set(allIds))
  }

  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  // Dùng useCallback để tối ưu
  const handleToggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2 p-1 bg-muted/30 rounded-lg border w-fit">
        <Button onClick={handleExpandAll} variant="ghost" size="sm" className="h-8 text-xs">
          <ListTree className="mr-2 h-3.5 w-3.5" />
          Mở tất cả
        </Button>
        <div className="w-[1px] h-4 bg-border" /> {/* Divider */}
        <Button onClick={handleCollapseAll} variant="ghost" size="sm" className="h-8 text-xs">
          <Minimize2 className="mr-2 h-3.5 w-3.5" />
          Đóng tất cả
        </Button>
      </div>

      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/categories/create">
            <PlusSquare />
            Thêm danh mục
          </Link>
        </Button>
      </div>

      {categoryTree.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">Chưa có danh mục nào.</p>
      ) : (
        categoryTree.map((category) => (
          <CategoryNode
            key={category.id}
            category={category}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
          />
        ))
      )}
    </div>
  )
}