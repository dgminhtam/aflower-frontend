"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { createBlog } from "@/app/api/blogs/action"
import { GalleryUpload } from "@/components/gallery-upload"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@workspace/ui/components/input-group"
import { Separator } from "@workspace/ui/components/separator"
import { Spinner } from "@workspace/ui/components/spinner"
import { Switch } from "@workspace/ui/components/switch"

export const createBlogSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống").max(255, "Tiêu đề quá dài"),
    slug: z.string().min(1, "Slug không được để trống").max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
    content: z.string().min(1, "Nội dung không được để trống"),
    shortDescription: z.string(),
    thumbnailId: z.number().min(1, "Vui lòng chọn ảnh đại diện"),
    isVisible: z.boolean(),
});

export type CreateBlogRequest = z.infer<typeof createBlogSchema>;

export function CreateBlogForm() {
    const form = useForm<CreateBlogRequest>({
        resolver: zodResolver(createBlogSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            shortDescription: "",
            thumbnailId: 0,
            isVisible: true,
        },
    })

    const titleValue = form.watch("title")

    useEffect(() => {
        if (titleValue) {
            const generatedSlug = titleValue
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d").replace(/Đ/g, "D")
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")

            form.setValue("slug", generatedSlug, { shouldValidate: true })
        }
    }, [titleValue, form])

    async function onSubmit(data: CreateBlogRequest) {
        try {
            await createBlog(data)
            toast.success("Tạo bài viết thành công")

            form.reset({
                title: "",
                slug: "",
                content: "",
                shortDescription: "",
                thumbnailId: 0,
                isVisible: true,
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
            <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">Tiêu đề <span className="text-destructive">*</span></FieldLabel>
                        <Input {...field} id="title" placeholder="Nhập tiêu đề bài viết" autoComplete="off" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="slug">Slug (URL) <span className="text-destructive">*</span></FieldLabel>
                        <Input {...field} id="slug" placeholder="tu-dong-tao-theo-tieu-de" autoComplete="off" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="shortDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="shortDescription">Mô tả ngắn <span className="text-destructive">*</span></FieldLabel>
                        <InputGroup>
                            <InputGroupTextarea
                                {...field}
                                id="shortDescription"
                                placeholder="Nhập mô tả ngắn..."
                                rows={3}
                                className="min-h-20 resize-none"
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

            <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="content">Nội dung <span className="text-destructive">*</span></FieldLabel>
                        <InputGroup>
                            <InputGroupTextarea
                                {...field}
                                id="content"
                                placeholder="Nhập nội dung bài viết (hỗ trợ HTML)..."
                                rows={15}
                                className="min-h-96 resize-none font-mono"
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

            <Controller
                name="isVisible"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FieldLabel className="text-base">Hiển thị công khai</FieldLabel>
                                <p className="text-sm text-muted-foreground">
                                    Công khai bài viết này trên cửa hàng
                                </p>
                            </div>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </div>
                    </Field>
                )}
            />

            <Controller
                name="thumbnailId"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="thumbnailId">Ảnh đại diện <span className="text-destructive">*</span></FieldLabel>
                        <GalleryUpload
                            initialMedia={[]}
                            onChange={(mediaIds) => {
                                if (mediaIds.length > 0) {
                                    field.onChange(mediaIds[0]);
                                } else {
                                    field.onChange(0);
                                }
                            }}
                            maxFiles={1}
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
                    ) : "Tạo bài viết"}
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
