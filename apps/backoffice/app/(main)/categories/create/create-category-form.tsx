"use client"

import { createCategory } from "@/app/api/categories/action"
import type { Category } from "@/app/lib/categories/definitions"
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils"
import { MultiSelectCombobox } from "@/components/multiple-select-combobox"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { ImageUpload } from "../../../../components/image-upload"

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(50, "Tên quá dài"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(255, "Mô tả quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
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
})

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;

function CreateCategoryForm({ categories = [] }: { categories: Category[] }) {
  const categoryOptions = convertCategoriesToMultiSelectOptions(categories);
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
    },
  })

  const nameValue = form.watch("name")
  React.useEffect(() => {
    if (nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
      form.setValue("slug", generatedSlug)
    }
  }, [nameValue, form.setValue])

  async function onSubmit(createCategoryRequest: CreateCategoryRequest) {

    try {
      await createCategory(createCategoryRequest)
      toast.success("Tạo danh mục thành công")
      form.reset();
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
      <FieldGroup className="grid grid-cols-2 gap-6">
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
                placeholder="Nhập tên danh mục"
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
                Slug <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-slug"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập slug danh mục"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-description">
              Mô tả danh mục
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="form-rhf-description"
                placeholder="Nhập mô tả danh mục"
                rows={6}
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
                field.onChange(value ? Number(value) : undefined);
              }}
              placeholder="Tìm kiếm"
              mode="single"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="active"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid}
            className="grid grid-cols-1"
          >
            <FieldContent>
              <FieldLabel htmlFor="form-rhf-active">
                Kích hoạt
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

      <Controller
        name="imageId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="image">
              Hình ảnh
            </FieldLabel>
            <ImageUpload
              onChange={field.onChange}
              value={field.value}
              error={form.formState.errors.imageId?.message}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Button disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? (
          <>
            <Spinner />
            Đang lưu...
          </>
        ) : (
          "Tạo"
        )}
      </Button>
      <Button type="button" variant="outline" onClick={() => router.back()}>
        Hủy
      </Button>
    </form>
  )
}

export default CreateCategoryForm