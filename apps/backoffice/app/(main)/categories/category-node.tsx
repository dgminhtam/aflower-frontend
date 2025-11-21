"use client"

import { deleteCategoryById } from "@/app/api/categories/action"
import { Category } from "@/app/lib/categories/definitions"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
// Giả sử Item component của bạn hỗ trợ className chuẩn
import { Item, ItemActions, ItemContent, ItemMedia } from "@workspace/ui/components/item"
import { Spinner } from "@workspace/ui/components/spinner"
import { ChevronDown, ChevronRight, Edit, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface CategoryNodeProps {
  category: Category
  // level không cần thiết nữa nếu dùng padding nested
  expandedIds: Set<number>
  onToggleExpand: (id: number) => void
}

export function CategoryNode({ category, expandedIds, onToggleExpand }: CategoryNodeProps) {
  const isExpanded = expandedIds.has(category.id)
  const hasChildren = category.children && category.children.length > 0

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategoryById(category.id)
      toast.success(`Đã xóa danh mục "${category.name}"!`)
      setIsAlertOpen(false)
      router.refresh() // Refresh data từ server
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi xóa danh mục.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative">
      <Item variant="outline" className="my-1 group hover:border-primary/50 transition-colors bg-background relative z-10">
        {/* Icon Toggle Expand */}
        <ItemMedia className="flex items-center gap-2 mr-2">
          {hasChildren ? (
            <Button
              onClick={(e) => {
                e.preventDefault() // Tránh click nhầm vào Link nếu Button nằm trong thẻ a (dù ở đây không phải)
                onToggleExpand(category.id)
              }}
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="w-6 h-6" /> // Spacer để thẳng hàng
          )}

          {/* Thumbnail */}
          <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
            <Image
              src={category.image?.urlThumbnail || "/placeholder.webp"}
              alt={category.image?.altText || category.name}
              className="object-cover"
              fill
              sizes="40px"
            />
          </div>
        </ItemMedia>

        {/* Content Info */}
        <ItemContent>
          <Link
            href={`/categories/${category.id}`}
            className="font-medium text-sm hover:text-primary hover:underline underline-offset-4 block"
          >
            {category.name}
          </Link>
          <span className="text-xs text-muted-foreground font-mono">{category.slug}</span>
        </ItemContent>

        {/* Actions & Status */}
        <ItemActions className="flex items-center gap-3">
          {/* Status Badge */}
          <Badge variant={category.active ? "outline" : "secondary"} className={category.active ? "text-green-600 border-green-200 bg-green-50" : ""}>
            {category.active ? "Hiện" : "Ẩn"}
          </Badge>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/categories/${category.id}`} className="cursor-pointer flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsAlertOpen(true)}
                className="text-destructive cursor-pointer flex items-center focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      {/* Render Children (Recursive) */}
      {hasChildren && isExpanded && (
        <div className="relative pl-6 ml-3 border-l border-dashed border-border/60">
          {/* Container này tạo thụt đầu dòng và đường kẻ nối */}
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}

      {/* Delete Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa <strong>{category.name}</strong>.<br />
              {hasChildren && <span className="text-red-500 block mt-1">Cảnh báo: Danh mục này có danh mục con. Hãy cân nhắc!</span>}
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? <Spinner /> : "Xóa vĩnh viễn"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}