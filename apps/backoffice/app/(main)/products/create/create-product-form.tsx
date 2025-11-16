"use client"

import React from "react"

import { createProduct } from "@/app/api/products/action"
import { Category } from "@/app/lib/categories/definitions"
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils"
import { Combobox } from "@/components/combobox"
import { ImageUpload } from "@/components/image-upload"
import { MultiSelectCombobox } from "@/components/multiple-select-combobox"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { X } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Separator } from "@workspace/ui/components/separator"

export const STATUS_VALUES = ["PUBLISHED", "DRAFT"] as const;
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(255, "Tên quá dài"),
  sku: z
    .string()
    .min(1, "SKU không được để trống")
    .max(255, "SKU quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(50, "Slug quá dài")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(255, "Mô tả quá dài"),
  price: z
    .number()
    .optional(),
  originPrice: z
    .number()
    .optional(),
  status: z.enum(STATUS_VALUES),
  categoryIds: z.array(z.number())
    .min(1, "Mô tả không được để trống"),
  imageId: z.number()
    .optional(),
  gallery: z
    .array(
      z.object({
        mediaId: z.number().nullable(),
      })
    )
    .optional()
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;

const statuses = [
  {
    value: "PUBLISHED",
    label: "Xuất bản",
  },
  {
    value: "DRAFT",
    label: "Nháp",
  }
]


export function CreateProductForm({ categories = [] }: { categories: Category[] }) {
  const categoryOptions = convertCategoriesToMultiSelectOptions(categories);
  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      slug: "",
      description: "",
      price: undefined,
      originPrice: undefined,
      status: "DRAFT",
      categoryIds: [],
      imageId: undefined,
      gallery: [],
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gallery",
  })
  async function onSubmit(createProductRequest: CreateProductRequest) {
    console.log(createProductRequest.name);
    try {
      await createProduct(createProductRequest)
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
              <FieldLabel htmlFor="name">
                Tên <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập tên sản phẩm"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="sku"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sku">
                SKU <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="sku"
                aria-invalid={fieldState.invalid}
                placeholder="Nhập sku sản phẩm"
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
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="slug"
              aria-invalid={fieldState.invalid}
              placeholder="Nhập slug sản phẩm"
              autoComplete="off"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">
              Mô tả danh mục
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="description"
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
      <FieldGroup className="grid grid-cols-2 gap-6">
        <Controller
          name="categoryIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="categoryIds">
                Danh mục
              </FieldLabel>
              <MultiSelectCombobox
                {...field}
                mode="multiple" // TypeScript thấy 'multiple'
                options={categoryOptions}
                value={(field.value || []).map(num => String(num))}

                // 'value' ở đây auto là string[]
                onChange={(value) => {
                  // Không cần Array.isArray!
                  field.onChange(value.map(str => Number(str)));
                }}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status">
                Trạng thái <span className="text-destructive">*</span>
              </FieldLabel>
              <Combobox
                {...field}
                defaultValue={field.value}
                options={statuses}
                onChange={field.onChange}
                label="Trạng thái" />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="grid grid-cols-2 gap-6">
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="price">
                Giá gốc <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  {...field}
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nhập Giá giảm"
                  autoComplete="off"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    field.onChange(v === "" ? undefined : Number(v))
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>VND</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="originPrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="origin-price">
                Giá gốc <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  {...field}
                  id="origin-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nhập Giá giảm"
                  autoComplete="off"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    field.onChange(v === "" ? undefined : Number(v))
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>VND</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Controller
        name="imageId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-sku">
              Ảnh chính
            </FieldLabel>
            <ImageUpload
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <FieldSet className="gap-4">
        <FieldLegend variant="label">Bộ sưu tập</FieldLegend>
        <FieldDescription>
          Thêm tối đa 5 tấm hình vào bộ sưu tập
        </FieldDescription>
        <FieldGroup className="grid grid-cols-3 gap-4">
          {
            fields.map((field, index) => (
              <Controller
                key={field.id}
                name={`gallery.${index}`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <FieldContent key={index}>
                      <ImageUpload
                      />
                      {
                        fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            <X />
                            Xóa ảnh
                          </Button>
                        )
                      }

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />
            ))
          }

        </FieldGroup>
      </FieldSet>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ mediaId: 0 })}
        disabled={fields.length >= 5}
      >
        Thêm 1 ảnh vào bộ sưu tập
      </Button>
      <Separator />
      <div>
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
        <Button type="button" variant="outline">
          Hủy
        </Button>
      </div>

    </form>
  )
}