"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@workspace/ui/components/carousel"
import { Loader2, Upload, X } from 'lucide-react'
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"
import { toast } from "sonner"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_IMAGES = 10

interface ProductGalleryProps {
    onMediaIdsChange?: (mediaIds: number[]) => void
    initialMedia?: Media[]
}

export function ProductGallery({ onMediaIdsChange, initialMedia = [] }: ProductGalleryProps) {
    const [uploadedMedia, setUploadedMedia] = useState<Media[]>(initialMedia)
    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleMediaIdsChange = (newMedia: Media[]) => {
        setUploadedMedia(newMedia)
        onMediaIdsChange?.(newMedia.map((m) => m.id))
    }

    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            return "File quá lớn. Kích thước tối đa là 5MB."
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Loại file không hợp lệ. Chỉ chấp nhận PNG, JPG, WEBP."
        }
        return null
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        if (uploadedMedia.length + files.length > MAX_IMAGES) {
            toast.error("Vượt quá giới hạn", {
                description: `Bạn có thể tải lên tối đa ${MAX_IMAGES} hình ảnh.`,
            })
            return
        }

        setIsLoading(true)

        try {
            const uploadedItems: Media[] = []

            for (const file of files) {
                const validationError = validateFile(file)
                if (validationError) {
                    toast.error("File không hợp lệ", { description: validationError })
                    continue
                }

                try {
                    const formData = new FormData()
                    formData.append("file", file)
                    const media: Media = await uploadMedia(formData)
                    uploadedItems.push(media)
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Upload failed"
                    toast.error("Upload thất bại", {
                        description: `${file.name}: ${errorMessage}`,
                    })
                }
            }

            if (uploadedItems.length > 0) {
                const newMedia = [...uploadedMedia, ...uploadedItems]
                handleMediaIdsChange(newMedia)
                toast.success("Upload thành công!", {
                    description: `${uploadedItems.length} hình ảnh đã được tải lên.`,
                })
            }
        } finally {
            setIsLoading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            const dataTransfer = new DataTransfer()
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file && file.type.startsWith("image/")) {
                    dataTransfer.items.add(file)
                }
            }

            if (dataTransfer.items.length === 0) {
                toast.error("File không hợp lệ", {
                    description: "Vui lòng chỉ thả file hình ảnh.",
                })
                return
            }

            fileInputRef.current!.files = dataTransfer.files
            handleImageChange({
                target: { files: dataTransfer.files },
            } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const handleRemoveImage = (mediaId: number) => {
        const newMedia = uploadedMedia.filter((m) => m.id !== mediaId)
        handleMediaIdsChange(newMedia)
        toast.success("Đã xóa hình ảnh")
    }

    const canAddMore = uploadedMedia.length < MAX_IMAGES
    const remainingSlots = MAX_IMAGES - uploadedMedia.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Product Gallery Images</h2>
                <p className="text-sm text-muted-foreground">
                    Add additional images for your product. (Up to {MAX_IMAGES} images)
                </p>
            </div>

            {/* Upload Area */}
            {canAddMore && (
                <div
                    onClick={() => !isLoading && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`cursor-pointer border-2 border-dashed rounded-lg p-8 transition-colors ${isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary hover:bg-muted/50"
                        }`}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                            <p className="text-sm font-medium">Đang tải lên...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    {isDragging ? "Thả để tải lên" : "Drag & drop additional product images here, or click to browse."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleImageChange}
                disabled={isLoading || !canAddMore}
                multiple
                className="hidden"
            />

            {/* Gallery Carousel */}
            {uploadedMedia.length > 0 && (
                <div className="space-y-3">
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-3">
                            {uploadedMedia.map((media) => (
                                <CarouselItem key={media.id} className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/5">
                                    <div className="relative group">
                                        <div className="relative w-full aspect-square rounded-md border border-input overflow-hidden bg-muted">
                                            <Image
                                                src={media.urlMedium || "/placeholder.svg?height=150&width=150"}
                                                alt="Gallery image"
                                                className="w-full h-full object-cover"
                                                width={150}
                                                height={150}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleRemoveImage(media.id)}
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-7 w-7"
                                            disabled={isLoading}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious type="button" variant="ghost"/>
                        <CarouselNext type="button" variant="ghost"/>
                    </Carousel>

                    {!canAddMore && (
                        <p className="text-sm text-muted-foreground">
                            Bạn đã đạt giới hạn {MAX_IMAGES} hình ảnh.
                        </p>
                    )}

                    {canAddMore && (
                        <p className="text-sm text-muted-foreground">
                            {remainingSlots} slot{remainingSlots > 1 ? "s" : ""} available
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
