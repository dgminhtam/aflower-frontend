"use client"

import { updateProductCollection, addProductsToCollection, removeProductsFromCollection } from "@/app/api/product-collections/action"
import type { ProductCollectionDetailResponse, UpdateProductCollectionRequest } from "@/app/lib/product-collections/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldError, FieldContent, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"
import { ChevronLeft, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { ImageUpload } from "../../../../components/image-upload"
import { Badge } from "@workspace/ui/components/badge"
import Image from "next/image"
import { AddProductsDialog } from "@/components/add-products-dialog"

const updateCollectionSchema = z.object({
    name: z
        .string()
        .min(1, "Vui lòng nhập tên bộ sưu tập")
        .max(100, "Tên quá dài"),
    slug: z
        .string()
        .max(100, "Slug quá dài")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
        .optional(),
    description: z
        .string()
        .max(500, "Mô tả quá dài")
        .optional(),
    metaTitle: z
        .string()
        .max(100, "Meta title quá dài")
        .optional(),
    metaDescription: z
        .string()
        .max(255, "Meta description quá dài")
        .optional(),
    metaKeywords: z
        .string()
        .max(255, "Meta keywords quá dài")
        .optional(),
    isFeatured: z.boolean().optional(),
    imageId: z.number().nullable(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

type FormData = z.infer<typeof updateCollectionSchema>;

interface UpdateCollectionFormProps {
    collection: ProductCollectionDetailResponse
}

function UpdateCollectionForm({ collection }: UpdateCollectionFormProps) {
    const router = useRouter();
    const [products, setProducts] = React.useState(collection.products || []);

    const form = useForm<FormData>({
        resolver: zodResolver(updateCollectionSchema),
        defaultValues: {
            name: collection.name,
            slug: collection.slug,
            description: collection.description || "",
            metaTitle: collection.metaTitle || "",
            metaDescription: collection.metaDescription || "",
            metaKeywords: collection.metaKeywords || "",
            isFeatured: collection.isFeatured,
            imageId: collection.image?.id ?? null,
            status: collection.status,
        },
    })

    async function onSubmit(data: FormData) {
        try {
            await updateProductCollection(collection.id, data as UpdateProductCollectionRequest)
            toast.success("Cập nhật bộ sưu tập thành công")
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
            }
        }
    }

    async function handleRemoveProduct(productId: number) {
        try {
            await removeProductsFromCollection(collection.id, [productId]);
            setProducts(products.filter(p => p.id !== productId));
            toast.success("Đã xóa sản phẩm khỏi bộ sưu tập");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Đã có lỗi xảy ra khi xóa sản phẩm")
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
                    <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa bộ sưu tập</h1>
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
                            <CardDescription>Điền các thông tin cơ bản cho bộ sưu tập sản phẩm.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="name">
                                                Tên bộ sưu tập <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Ví dụ: Bộ sưu tập mùa hè..."
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
                                            <FieldLabel htmlFor="slug">
                                                Đường dẫn (Slug)
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="slug"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="bo-suu-tap-mua-he"
                                                autoComplete="off"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Thay đổi slug sẽ ảnh hưởng đến SEO và liên kết cũ.</p>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="description">
                                            Mô tả
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="description"
                                                placeholder="Nhập mô tả chi tiết về bộ sưu tập..."
                                                rows={4}
                                                className="min-h-24 resize-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.value?.length || 0}/500 kí tự
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

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                            <CardDescription>Tối ưu hóa công cụ tìm kiếm.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Controller
                                name="metaTitle"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
                                        <Input
                                            {...field}
                                            id="metaTitle"
                                            placeholder="Tiêu đề SEO..."
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="metaDescription"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="metaDescription"
                                                placeholder="Mô tả SEO..."
                                                rows={3}
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.value?.length || 0}/255 kí tự
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="metaKeywords"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="metaKeywords">Meta Keywords</FieldLabel>
                                        <Input
                                            {...field}
                                            id="metaKeywords"
                                            placeholder="Từ khóa, phân cách, bằng, dấu phẩy"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Sản phẩm trong bộ sưu tập</CardTitle>
                                <CardDescription>Quản lý danh sách sản phẩm thuộc bộ sưu tập này.</CardDescription>
                            </div>
                            <AddProductsDialog
                                collectionId={collection.id}
                                existingProductIds={products.map(p => p.id)}
                                onSuccess={(newProducts) => {
                                    setProducts([...products, ...newProducts]);
                                    router.refresh();
                                }}
                            />
                        </CardHeader>
                        <CardContent>
                            {products.length > 0 ? (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                {product.image && (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={60}
                                                        height={60}
                                                        className="rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveProduct(product.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Bộ sưu tập này chưa có sản phẩm nào.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái</CardTitle>
                            <CardDescription>Thiết lập hiển thị cho bộ sưu tập.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                        className="flex items-center justify-between"
                                    >
                                        <FieldContent>
                                            <FieldLabel htmlFor="status">
                                                Đang hoạt động
                                            </FieldLabel>
                                        </FieldContent>
                                        <Switch
                                            id="status"
                                            checked={field.value === "ACTIVE"}
                                            onCheckedChange={(checked) => field.onChange(checked ? "ACTIVE" : "INACTIVE")}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="isFeatured"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                        className="flex items-center justify-between"
                                    >
                                        <FieldContent>
                                            <FieldLabel htmlFor="isFeatured">
                                                Bộ sưu tập nổi bật
                                            </FieldLabel>
                                        </FieldContent>
                                        <Switch
                                            id="isFeatured"
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
                            <CardDescription>Ảnh đại diện cho bộ sưu tập.</CardDescription>
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
                                            initialMedia={collection.image}
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

export default UpdateCollectionForm
