"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Import UI & Actions
import { Combobox } from "@/components/combobox"
import { ImageUpload } from "@/components/image-upload"
import { MultiSelectCombobox } from "@/components/multiple-select-combobox"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Separator } from "@workspace/ui/components/separator"
import { Spinner } from "@workspace/ui/components/spinner"

// Import Defs
import { updateProduct } from "@/app/api/products/action";
import { Category } from "@/app/lib/categories/definitions"
import { Product, STATUS_VALUES } from "@/app/lib/products/definitions"
import { convertCategoriesToMultiSelectOptions } from "@/app/lib/products/utils"
import { GalleryUpload } from "@/components/gallery-upload"
import { AlternativeProductsManager } from "./alternative-products-manager"

// --- SCHEMA ---
export const updateProductSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(255),
  sku: z.string().min(1, "SKU không được để trống").max(255),
  slug: z.string().min(1, "Slug không được để trống").max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ (chỉ chứa chữ thường, số, gạch ngang)"),
  description: z.string().min(1, "Mô tả không được để trống").max(2000),
  price: z.number().optional(),
  originPrice: z.number().optional(),
  status: z.enum(STATUS_VALUES),
  categoryIds: z.array(z.number()).min(1, "Chọn ít nhất 1 danh mục"),
  imageId: z.number().nullable(),
  gallery: z.array(z.number()).optional(),
});

export type UpdateProductRequest = z.infer<typeof updateProductSchema>;

const statuses = [
  { value: "PUBLISHED", label: "Xuất bản" },
  { value: "DRAFT", label: "Nháp" }
]

interface UpdateProductFormProps {
  categories: Category[];
  product: Product;
}

export function UpdateProductForm({ categories, product }: UpdateProductFormProps) {
  const categoryOptions = convertCategoriesToMultiSelectOptions(categories);

  const form = useForm<UpdateProductRequest>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      description: product.description || "",
      price: product.price,
      originPrice: product.originPrice,
      status: product.status as typeof STATUS_VALUES[number],
      categoryIds: product.categories?.map((c) => c.id) || [],
      imageId: product.image?.id ?? null,
      gallery: product.gallery?.map((c) => c.id) || [],
    },
  })

  // --- XỬ LÝ SLUG ---
  const nameValue = form.watch("name")
  const slugValue = form.watch("slug")

  useEffect(() => {
    if (nameValue && !slugValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
      form.setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [nameValue, slugValue, form.setValue])

  // --- SUBMIT ---
  async function onSubmit(data: UpdateProductRequest) {
    try {
      await updateProduct(product.id, data);
      console.log("Updating:", { id: product.id, ...data });

      await new Promise(r => setTimeout(r, 1000));

      toast.success("Cập nhật sản phẩm thành công")
      form.reset(data);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Đã có lỗi xảy ra.")
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
              <Input {...field} id="name" placeholder="Nhập tên sản phẩm" />
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
              <Input {...field} id="sku" placeholder="Mã SKU" />
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
            <FieldLabel htmlFor="slug">URL Slug <span className="text-destructive">*</span></FieldLabel>
            <Input {...field} id="slug" placeholder="duong-dan-san-pham" />
            <p className="text-xs text-muted-foreground mt-1">Thay đổi slug sẽ ảnh hưởng đến SEO và liên kết cũ.</p>
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
            <FieldLabel htmlFor="description">Mô tả</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="description"
                rows={6}
                className="min-h-24 resize-none"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="tabular-nums text-xs">
                  {field.value?.length || 0} ký tự
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
              <FieldLabel>Danh mục</FieldLabel>
              <MultiSelectCombobox
                {...field}
                mode="multiple"
                options={categoryOptions}
                value={(field.value || []).map(String)}
                onChange={(val) => field.onChange(val.map(Number))}
                placeholder="Chọn danh mục..."
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
              <FieldLabel>Trạng thái <span className="text-destructive">*</span></FieldLabel>
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
        {/* Giá Bán (Price) */}
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
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>VND</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Giá Gốc (Origin Price) */}
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
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
            <FieldLabel>Ảnh đại diện</FieldLabel>
            <ImageUpload
              value={field.value}
              initialMedia={product.image}
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
            <FieldLabel>Thư viện ảnh</FieldLabel>
            <GalleryUpload
              onChange={field.onChange}
              initialMedia={product.gallery ? product.gallery : []}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Separator />

      <AlternativeProductsManager
        productId={product.id}
        initialAlternatives={product.alternativeProducts || []}
      />

      <Separator />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <><Spinner className="mr-2" /> Đang lưu...</>
          ) : "Lưu thay đổi"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Quay lại
        </Button>
      </div>

    </form>
  )
}