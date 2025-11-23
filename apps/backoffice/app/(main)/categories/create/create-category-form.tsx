"use client"

import { createCategory } from "@/app/api/categories/action"
import type { Category } from "@/app/lib/categories/definitions"
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
import * as z from "zod"
import { ImageUpload } from "../../../../components/image-upload"

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(50, "Tên quá dài"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(255, "Mô tả quá dài"),
  slug: z
    .string()
    .min(1, "Vui lòng nhập slug")
    .max(50, "Slug quá dài")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  imageId: z
    .number()
    .nullable(),
  active: z
    .boolean(),
  parentId: z
    .number()
    .nullable(),
  showOnHome: z.boolean().optional(),
})

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;

function CreateCategoryForm({ categories = [] }: { categories: Category[] }) {
  const categoryOptions = React.useMemo(() => convertCategoriesToMultiSelectOptions(categories), [categories]);
  const router = useRouter();
  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      imageId: null,
      active: true,
      parentId: null,
      showOnHome: false,
    },
  })

  const nameValue = form.watch("name")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

  React.useEffect(() => {
    if (nameValue && !isSlugManuallyEdited) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
      form.setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [nameValue, isSlugManuallyEdited, form.setValue])

  async function onSubmit(createCategoryRequest: CreateCategoryRequest) {

    try {
      await createCategory(createCategoryRequest)
      toast.success("Tạo danh mục thành công")
      form.reset();
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
          <h1 className="text-2xl font-bold tracking-tight">Thêm danh mục mới</h1>
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
                Lưu danh mục
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
              <CardDescription>Điền các thông tin cơ bản cho danh mục sản phẩm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-name">
                        Tên danh mục <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Ví dụ: Hoa hồng, Hoa lan..."
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-slug">
                        Đường dẫn (Slug) <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-slug"
                        aria-invalid={fieldState.invalid}
                        placeholder="vi-du-hoa-hong"
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                          setIsSlugManuallyEdited(true);
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                      onChange={(value) => {
                        field.onChange(value ? Number(value) : null);
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
                    <FieldLabel htmlFor="form-rhf-description">
                      Mô tả
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-rhf-description"
                        placeholder="Nhập mô tả chi tiết về danh mục này..."
                        rows={4}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value.length}/255 kí tự
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="flex items-center justify-between"
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-active">
                        Đang hoạt động
                      </FieldLabel>
                    </FieldContent>
                    <Switch
                      id="form-rhf-active"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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

export default CreateCategoryForm