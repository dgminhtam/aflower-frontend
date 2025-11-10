"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, MoreVertical } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type { Category } from "@/app/lib/categories/definitions"
import { PlusSquare } from "lucide-react"
import Image from "next/image"
import { Badge } from "@workspace/ui/components/badge"

interface CategoryNodeProps {
  category: Category
  level?: number
  expandedIds?: Set<number>
  onToggleExpand?: (id: number) => void
}

function CategoryNode({ category, level = 0, expandedIds = new Set(), onToggleExpand }: CategoryNodeProps) {
  const isExpanded = expandedIds.has(category.id)
  const hasChildren = category.children && category.children.length > 0

  const handleEdit = () => {
    console.log("Edit category:", category.id, category.name)
  }

  const handleDelete = () => {
    console.log("Delete category:", category.id, category.name)
  }

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 rounded-lg hover:bg-muted/50 transition-colors bg-background border border-border ${level != 0 ? "ml-3" : ""} my-2 p-1`}
      >
        <button
          onClick={() => onToggleExpand?.(category.id)}
          className="flex items-center gap-3 flex-1 px-3 py-2 text-left"
        >
          {hasChildren ? (
            <ChevronRight size={18} className={`flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          ) : (
            <div className="w-[18px]" />
          )}
          {category.image ? (
            <Image
              src={category.image.urlThumbnail || "/placeholder.svg"}
              alt={category.image.altText || category.name}
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              width={150}
              height={150}
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0" />
          )}
          <div className="flex-1">
            <Link
              href={`/categories/${category.id}`}
              prefetch={false}
              className="flex-1 font-medium text-foreground hover:text-primary hover:underline transition-colors"
            >
              {category.name}
            </Link>
            <p className="text-xs text-muted-foreground">{category.slug}</p>
          </div>
          <div className="flex items-right">
            {category.active ? (
              <Badge className="bg-green-600">Hoạt động</Badge>
            ) : (
              <Badge variant="destructive">Không hoạt động</Badge>
            )}
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l border-border ml-3">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryTreeProps {
  categoryTree: Category[]
}

export function CategoryTree({ categoryTree }: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

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
