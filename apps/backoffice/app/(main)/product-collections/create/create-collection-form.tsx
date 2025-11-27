"use client"

import { createProductCollection } from "@/app/api/product-collections/action"
import type { CreateProductCollectionRequest } from "@/app/lib/product-collections/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldError, FieldContent, FieldLabel } from "@workspace/ui/components/field"
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

const createCollectionSchema = z.object({
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

type FormData = z.infer<typeof createCollectionSchema>;

function CreateCollectionForm() {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: "",
            isFeatured: false,
            imageId: null,
            status: "ACTIVE",
        },
    })

    const nameValue = form.watch("name")
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false)

    React.useEffect(() => {
        if (nameValue && !isSlugManuallyEdited) {
            const generatedSlug = nameValue
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D")
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")
            form.setValue("slug", generatedSlug, { shouldValidate: true })
        }
    }, [nameValue, isSlugManuallyEdited, form])

    async function onSubmit(data: FormData) {
        try {
            await createProductCollection(data as CreateProductCollectionRequest)
            toast.success("Tạo bộ sưu tập thành công")
            form.reset();
            router.push("/product-collections");
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
                    <h1 className="text-2xl font-bold tracking-tight">Thêm bộ sưu tập mới</h1>
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
                                Lưu bộ sưu tập
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

export default CreateCollectionForm
