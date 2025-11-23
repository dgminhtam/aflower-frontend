"use client"

import { updateCategory } from "@/app/api/categories/action"
import type { Category } from "@/app/lib/categories/definitions"
import { Media } from "@/app/lib/media/definitions"
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils"
import { MultiSelectCombobox } from "@/components/multiple-select-combobox"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"
import { ChevronLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { ImageUpload } from "../../../../components/image-upload"

const updateCategorySchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50, "Tên quá dài"),
  description: z.string().min(1, "Mô tả không được để trống").max(255, "Mô tả quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(50, "Slug quá dài")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  imageId: z.number().nullable(),
  active: z.boolean(),
  parentId: z.number().nullable(),
})

export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;

interface UpdateCategoryFormProps {
  categoryId: number;
  initialData: {
    name: string;
    description: string;
    slug: string;
    image?: Media;
    active: boolean;
    parentId?: number;
  }
  categories: Category[];
}

function UpdateCategoryForm({ categoryId, initialData, categories = [] }: UpdateCategoryFormProps) {
  const router = useRouter()
  const categoryOptions = React.useMemo(() => convertCategoriesToMultiSelectOptions(categories), [categories]);
  const form = useForm<UpdateCategoryRequest>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      slug: initialData.slug,
      imageId: initialData.image?.id ?? null,
      active: initialData.active,
      parentId: initialData.parentId ?? null
    },
  })

  async function onSubmit(updateCategoryRequest: UpdateCategoryRequest) {
    try {
      await updateCategory(categoryId, updateCategoryRequest);
      toast.success("Cập nhật danh mục thành công!")
      router.push("/categories");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Cập nhật danh mục</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy bỏ
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Cập nhật các thông tin cơ bản cho danh mục.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-name">Tên danh mục <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Nhập tên danh mục"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-slug">
                        Slug <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-slug"
                        aria-invalid={fieldState.invalid}
                        placeholder="Nhập slug danh mục"
                        autoComplete="off"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name="parentId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parent-category">Danh mục cha</FieldLabel>
                    <MultiSelectCombobox
                      options={categoryOptions}
                      value={field.value ? String(field.value) : null}
                      error={form.formState.errors.parentId?.message}
                      onChange={(val) => {
                        const numericValue = val ? Number(val) : null;
                        field.onChange(numericValue);
                      }}
                      placeholder="Chọn danh mục cha (nếu có)"
                      mode="single"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-description">Mô tả danh mục</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-description"
                        placeholder="Nhập mô tả danh mục"
                        rows={4}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">{field.value.length}/255 kí tự</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
              <CardDescription>Thiết lập hiển thị cho danh mục.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Controller
                name="active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid} className="flex items-center justify-between">
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-active">Đang hoạt động</FieldLabel>
                    </FieldContent>
                    <Switch
                      id="form-rhf-active"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Ảnh đại diện cho danh mục.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="imageId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ImageUpload
                      onChange={(value) => field.onChange(value ?? null)}
                      value={field.value}
                      error={form.formState.errors.imageId?.message}
                      initialMedia={initialData.image}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

export default UpdateCategoryForm