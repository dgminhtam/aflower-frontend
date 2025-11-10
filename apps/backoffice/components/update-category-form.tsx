"use client"

import { Spinner } from "@workspace/ui/components/spinner"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { CategorySelect } from "./category-select"
import type { Category, Media, UpdateCategoryRequest } from "@/app/lib/categories/definitions"
import { ImageUpload } from "./image-upload"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50, "Tên quá dài"),
  description: z.string().min(1, "Mô tả không được để trống").max(200, "Mô tả quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(50, "Slug quá dài")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  imageId: z.number().optional(),
  active: z.boolean().default(true),
  parentId: z.string().optional(),
})

interface UpdateCategoryFormProps {
  categoryId: number
  initialData: {
    name: string
    description: string
    slug: string
    image?: Media
    active: boolean
    parentId?: string
  }
  categories: Category[]
  onUpdateCategory: (id: number, data: UpdateCategoryRequest) => Promise<void>
}

function UpdateCategoryForm({ categoryId, initialData, categories = [], onUpdateCategory }: UpdateCategoryFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      slug: initialData.slug,
      imageId: initialData.image?.id,
      active: initialData.active,
      parentId: initialData.parentId,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form

  const statusValue = watch("active")
  const parentIdValue = watch("parentId")
  const imageIdValue = watch("imageId")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null)
    setApiSuccess(null)
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: values.name,
      description: values.description,
      slug: values.slug,
      imageId: values.imageId,
      active: values.active,
      parentId: values.parentId || undefined,
    }

    try {
      await onUpdateCategory(categoryId, updateCategoryRequest)
      setApiSuccess("Cập nhật danh mục thành công!")
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        setApiError("Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
      }
      setApiSuccess(null)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        {/* Name and Slug Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input id="name" type="text" placeholder="Nhập tên danh mục" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input id="slug" type="text" placeholder="auto-generated" {...register("slug")} />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Mô tả <span className="text-destructive">*</span>
          </Label>
          <Textarea id="description" placeholder="Mô tả chi tiết về danh mục" {...register("description")} rows={4} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategorySelect
            value={parentIdValue}
            onChange={(value) => setValue("parentId", value)}
            error={errors.parentId?.message}
            categories={categories}
            categoryIdToDisable={categoryId}
          />

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <div className="flex items-center justify-between px-4 bg-muted rounded-lg border border-border h-full">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {statusValue ? "Đang hoạt động" : "Bị vô hiệu hóa"}
                </p>
              </div>
              <Switch id="status" checked={statusValue} onCheckedChange={(checked) => setValue("active", checked)} />
            </div>
          </div>
        </div>
      </div>
      {imageIdValue}
      <ImageUpload
        value={imageIdValue}
        onChange={(value) => setValue("imageId", value)}
        initialMedia={initialData.image}
        error={errors.imageId?.message}
      />

      {apiSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">{apiSuccess}</p>
        </div>
      )}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800">{apiError}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Spinner className="size-4 mr-2" />
              Đang lưu...
            </>
          ) : (
            "Cập nhật"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  )
}

export default UpdateCategoryForm
