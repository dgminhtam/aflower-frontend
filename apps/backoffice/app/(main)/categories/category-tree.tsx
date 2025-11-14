"use client"

import { deleteCategoryById } from "@/app/api/categories/action"
import type { Category } from "@/app/lib/categories/definitions"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Spinner } from "@workspace/ui/components/spinner"
import { ChevronDown, ChevronRight, MoreVertical, PlusSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

interface CategoryNodeProps {
  category: Category
  level?: number
  expandedIds?: Set<number>
  onToggleExpand?: (id: number) => void
}

function CategoryNode({ category, level = 0, expandedIds = new Set(), onToggleExpand }: CategoryNodeProps) {
  const isExpanded = expandedIds.has(category.id)
  const hasChildren = category.children && category.children.length > 0
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const router = useRouter()

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategoryById(category.id)
      toast.success(`Đã xóa danh mục "${category.name}"!`)
      setIsDeleting(false)
      setIsAlertOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra khi xóa danh mục.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="select-none">
      <div className={`flex items-center gap-2 rounded-lg hover:bg-muted/50 transition-colors bg-background border border-border ${level != 0 ? "ml-3" : ""} my-2 p-1`}>
        <div className="flex items-center gap-3 flex-1 px-3 py-2 text-left">
          {hasChildren ? (
            <Button onClick={() => onToggleExpand?.(category.id)} variant="ghost" size="icon">
              {isExpanded ? <ChevronRight /> : <ChevronDown />}
            </Button>
          ) : (
            <Button variant="ghost" size="icon"></Button>
          )}
          {category.image ? (
            <Image
              src={category.image.urlThumbnail || "/placeholder.webp"}
              alt={category.image.altText || category.name}
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              width={150}
              height={150}
            />
          ) : (
            <Image
              src={"/placeholder.webp"}
              alt={category.name}
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              width={150}
              height={150}
            />
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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/categories/${category.id}`}>
                Sửa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsAlertOpen(true)}
              className="text-destructive"
              onSelect={(e) => e.preventDefault()}
            >
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Danh mục "{category.name}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

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
