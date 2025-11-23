"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Import UI & Actions
import { createProduct } from "@/app/api/products/action"
import { Category } from "@/app/lib/categories/definitions"
import { STATUS_VALUES } from "@/app/lib/products/definitions"
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils"

import { Combobox } from "@/components/combobox"
import { GalleryUpload } from "@/components/gallery-upload"
import { ImageUpload } from "@/components/image-upload"
import { MultiSelectCombobox } from "@/components/multiple-select-combobox"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Separator } from "@workspace/ui/components/separator"
import { Spinner } from "@workspace/ui/components/spinner"

// --- SCHEMA ---
export const createProductSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(255, "Tên quá dài"),
  sku: z.string().min(1, "SKU không được để trống").max(255, "SKU quá dài"),
  slug: z.string().min(1, "Slug không được để trống").max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  description: z.string().min(1, "Mô tả không được để trống").max(2000, "Mô tả quá dài"),
  price: z.number().optional(),
  originPrice: z.number().optional(),
  status: z.enum(STATUS_VALUES),
  categoryIds: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 danh mục"),
  imageId: z.number().nullable(),
  gallery: z.array(z.number()).optional(),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;

const statuses = [
  { value: "PUBLISHED", label: "Xuất bản" },
  { value: "DRAFT", label: "Nháp" }
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
      imageId: null,
      gallery: [],
    },
  })

  // --- AUTO GENERATE SLUG ---
  const nameValue = form.watch("name")

  useEffect(() => {
    if (nameValue) {
      // Logic tạo slug chuẩn SEO: Chữ thường + Bỏ dấu + Thay khoảng trắng bằng gạch ngang
      const generatedSlug = nameValue
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Xử lý chữ đ
        .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
        .replace(/[^\w-]/g, "") // Bỏ ký tự đặc biệt còn lại

      form.setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [nameValue, form.setValue])

  // --- SUBMIT ---
  async function onSubmit(data: CreateProductRequest) {
    try {
      await createProduct(data)
      toast.success("Tạo sản phẩm thành công")

      // Reset form về trạng thái ban đầu để nhập sản phẩm tiếp theo
      form.reset({
        name: "",
        sku: "",
        slug: "",
        description: "",
        price: undefined,
        originPrice: undefined,
        status: "DRAFT",
        categoryIds: [],
        imageId: null,
        gallery: [],
      });
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

      {/* Tên & SKU */}
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Tên sản phẩm <span className="text-destructive">*</span></FieldLabel>
              <Input {...field} id="name" placeholder="Nhập tên sản phẩm" autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="sku"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sku">SKU <span className="text-destructive">*</span></FieldLabel>
              <Input {...field} id="sku" placeholder="Mã SKU" autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Slug */}
      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="slug">Slug (URL) <span className="text-destructive">*</span></FieldLabel>
            <Input {...field} id="slug" placeholder="tu-dong-tao-theo-ten" autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Mô tả */}
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">Mô tả sản phẩm <span className="text-destructive">*</span></FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="description"
                placeholder="Nhập mô tả chi tiết..."
                rows={6}
                className="min-h-24 resize-none"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="tabular-nums text-xs">
                  {field.value.length} ký tự
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Danh mục & Trạng thái */}
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="categoryIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="categoryIds">Danh mục <span className="text-destructive">*</span></FieldLabel>
              <MultiSelectCombobox
                {...field}
                mode="multiple"
                options={categoryOptions}
                placeholder="Chọn danh mục..."
                value={(field.value || []).map(String)}
                onChange={(value) => field.onChange(value.map(Number))}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status">Trạng thái <span className="text-destructive">*</span></FieldLabel>
              <Combobox
                {...field}
                options={statuses}
                label="Chọn trạng thái"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Giá bán & Giá gốc */}
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Giá bán */}
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="price">Giá bán</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  {...field}
                  id="price"
                  placeholder="0"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Giá niêm yết */}
        <Controller
          name="originPrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="origin-price">Giá niêm yết (Gốc)</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  {...field}
                  id="origin-price"
                  placeholder="0"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Ảnh đại diện */}
      <Controller
        name="imageId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="imageId">Ảnh đại diện</FieldLabel>
            <ImageUpload
              value={field.value}
              initialMedia={null} // Form tạo mới chưa có ảnh
              onChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Thư viện ảnh */}
      <Controller
        name="gallery"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="gallery">Thư viện ảnh</FieldLabel>
            <GalleryUpload
              onChange={field.onChange}
              initialMedia={[]}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Separator />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <><Spinner className="mr-2" /> Đang tạo...</>
          ) : "Tạo sản phẩm"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Hủy
        </Button>
      </div>

    </form>
  )
}