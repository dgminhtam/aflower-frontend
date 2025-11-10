"use client"

import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { Category } from "@/app/lib/categories/definitions"
import { useMemo } from "react" // 💡 1. Import useMemo

interface CategorySelectProps {
  value?: string // Giá trị từ form cha (là ID hoặc undefined)
  onChange: (value: string | undefined) => void // 💡 2. Thay đổi: Cho phép trả về undefined
  error?: string
  categories: Category[]
  categoryIdToDisable?: number // 💡 1. Thêm prop mới
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
  categoryIdToDisable, // 💡 2. Nhận prop mới
}: CategorySelectProps) {
  // 💡 3. Tối ưu hiệu suất bằng useMemo
  const flattenedCategories = useMemo(
    () => flattenCategoryTree(categories),
    [categories],
  )

  // 💡 3. TÌM CÁC ID CẦN VÔ HIỆU HÓA
  const disabledIds = useMemo(() => {
    // Luôn khởi tạo một Set rỗng
    const disabledSet = new Set<number>()
    if (!categoryIdToDisable) {
      return disabledSet
    }

    // Tìm danh mục đang sửa trong danh sách đã làm phẳng
    const categoryToDisableIndex = flattenedCategories.findIndex(
      (c) => c.id === categoryIdToDisable,
    )

    if (categoryToDisableIndex === -1) {
      // Nếu không tìm thấy (trường hợp hiếm), chỉ vô hiệu hóa chính nó
      disabledSet.add(categoryIdToDisable)
      return disabledSet
    }

    // Lấy cấp độ (level) của danh mục đang sửa
    const categoryToDisable = flattenedCategories[categoryToDisableIndex]
    const levelToDisable = categoryToDisable?.level

    // Vô hiệu hóa chính nó
    disabledSet.add(categoryToDisable ? categoryToDisable.id : -1)

    // Duyệt qua tất cả danh mục *sau* nó trong danh sách
    for (
      let i = categoryToDisableIndex + 1;
      i < flattenedCategories.length;
      i++
    ) {
      const category = flattenedCategories[i]
      // Nếu danh mục có cấp độ (level) LỚN HƠN, nó là con/cháu
      if (category && levelToDisable && category.level > levelToDisable) {
        disabledSet.add(category.id)
      } else {
        // Nếu level bằng hoặc nhỏ hơn, nó là anh em (sibling) hoặc chú bác (uncle)
        // Dừng vòng lặp vì đã thoát khỏi nhánh của nó
        break
      }
    }

    return disabledSet
  }, [flattenedCategories, categoryIdToDisable])

  // 💡 4. Hàm xử lý trung gian để chuyển đổi giá trị
  const handleValueChange = (internalValue: string) => {
    if (internalValue === "no-parent") {
      onChange(undefined) // Trả về undefined cho form cha
    } else {
      onChange(internalValue) // Trả về ID (dạng string)
    }
  }

  // 💡 5. Tính toán giá trị nội bộ
  // Nếu value từ cha là undefined, Select sẽ dùng "no-parent"
  const internalValue = value || "no-parent"

  return (
    <div className="space-y-2">
      <Label htmlFor="parent-category">Danh mục cha</Label>
      {/* 💡 6. Sử dụng giá trị nội bộ và hàm xử lý mới */}
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
              // 💡 4. Vô hiệu hóa nếu ID nằm trong Set
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