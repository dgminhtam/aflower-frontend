"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import type { Category, CreateCategoryRequest } from "@/app/lib/categories/definitions"
import { createCategory } from "@/app/lib/categories/action"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Spinner } from "@workspace/ui/components/spinner"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { CategorySelect } from "./category-select"
import { ImageUpload } from "./image-upload"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { AlertCircleIcon } from "lucide-react"

const formSchema = z.object({
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
    .optional(),
  active: z
    .boolean(),
  parentId: z
    .string()
    .min(1)
    .optional(),
})

function CreateCategoryForm({ categories = [] }: { categories: Category[] }) {
  const router = useRouter();
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      imageId: undefined,
      active: true,
      parentId: undefined,
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null)
    setApiSuccess(null)
    const createCategoryRequest: CreateCategoryRequest = {
      name: values.name,
      description: values.description,
      slug: values.slug,
      imageId: values.imageId,
      active: values.active,
      parentId: values.parentId || undefined,
    }

    try {
      await createCategory(createCategoryRequest)
      setApiSuccess("Tạo danh mục thành công!")
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup className="grid grid-cols-2 gap-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-name">
                  Tên danh mục
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
              <FieldLabel htmlFor="parent-category">
                Danh mục cha
              </FieldLabel>
              <CategorySelect
                categories={categories}
                error={form.formState.errors.parentId?.message}
                onChange={field.onChange}
                value={field.value}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
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
        {/* === UPLOAD ẢNH (Custom Component) === */}
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
        {/* === HIỂN THỊ LỖI API === */}
        {apiSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">{apiSuccess}</p>
          </div>
        )}
        {apiError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Xảy ra lỗi.</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {/* === NÚT SUBMIT === */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="size-4 mr-2" />
                Đang lưu...
              </>
            ) : (
              "Tạo"
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

export default CreateCategoryForm