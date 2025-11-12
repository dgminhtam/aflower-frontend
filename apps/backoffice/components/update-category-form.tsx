"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import type { Category, Media, UpdateCategoryRequest } from "@/app/lib/categories/definitions"
import { useRouter } from "next/navigation"
import { CategorySelect } from "./category-select"
import { ImageUpload } from "./image-upload"

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50, "Tên quá dài"),
  description: z.string().min(1, "Mô tả không được để trống").max(255, "Mô tả quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(50, "Slug quá dài")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  imageId: z.number().optional(),
  active: z.boolean(),
  parentId: z.number().optional(),
})

interface UpdateCategoryFormProps {
  categoryId: number
  initialData: {
    name: string
    description: string
    slug: string
    image?: Media
    active: boolean
    parentId?: number
  }
  categories: Category[]
  onUpdateCategory: (id: number, data: UpdateCategoryRequest) => Promise<void>
}

function UpdateCategoryForm({ categoryId, initialData, categories = [], onUpdateCategory }: UpdateCategoryFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      slug: initialData.slug,
      imageId: initialData.image?.id,
      active: initialData.active,
      parentId: initialData.parentId
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: values.name,
      description: values.description,
      slug: values.slug,
      imageId: values.imageId,
      active: values.active,
      parentId: values.parentId,
    }

    try {
      await onUpdateCategory(categoryId, updateCategoryRequest)
      toast.success("Cập nhật danh mục thành công!")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="grid grid-cols-2 gap-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-name">Tên danh mục</FieldLabel>
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
                  rows={6}
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

        <Controller
          name="parentId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="parent-category">Danh mục cha</FieldLabel>
              <CategorySelect
                categories={categories}
                error={form.formState.errors.parentId?.message}
                onChange={field.onChange}
                value={field.value}
                categoryIdToDisable={categoryId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="active"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid} className="grid grid-cols-1">
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-active">Kích hoạt</FieldLabel>
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
        <Controller
          name="imageId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="image">Hình ảnh</FieldLabel>
              <ImageUpload
                onChange={field.onChange}
                value={field.value}
                error={form.formState.errors.imageId?.message}
                initialMedia={initialData.image}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-4 pt-2 border-t border-border">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
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
    </Form>
  )
}

export default UpdateCategoryForm