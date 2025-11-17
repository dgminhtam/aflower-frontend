"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Loader2, Upload, X, GripVertical, Trash2 } from 'lucide-react'
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"
import { toast } from "sonner"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_IMAGES = 10

interface ProductGalleryProps {
    value: number[]
    onChange: (mediaIds: number[]) => void
    onBlur?: () => void;
    disabled?: boolean;
    initialMedias: Media[]
}

export function ProductGallery({ value, onChange,onBlur,disabled, initialMedias = [] }: ProductGalleryProps) {
    const [uploadedMedia, setUploadedMedia] = useState<Media[]>(initialMedias)
    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [draggedId, setDraggedId] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleMediaIdsChange = (newMedia: Media[]) => {
        setUploadedMedia(newMedia)
        onChange(newMedia.map((m) => m.id))
    }

    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            return "File is too large. Maximum size is 5MB."
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Invalid file type. Only PNG, JPG, and WEBP are accepted."
        }
        return null
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        if (uploadedMedia.length + files.length > MAX_IMAGES) {
            toast.error("Upload limit exceeded", {
                description: `You can upload a maximum of ${MAX_IMAGES} images.`,
            })
            return
        }

        setIsLoading(true)

        try {
            const uploadPromises = files.map(async (file) => {
                const validationError = validateFile(file)
                if (validationError) {
                    toast.error("Invalid file", { description: validationError })
                    return null // Bỏ qua file lỗi
                }

                try {
                    const formData = new FormData()
                    formData.append("file", file)
                    const media: Media = await uploadMedia(formData)
                    return media
                } catch (err) {
                    toast.error("Invalid file", { description: validationError })
                    return null // Bỏ qua file lỗi
                }
            })

            const uploadedItems = (await Promise.all(uploadPromises)).filter((item): item is Media => item !== null)

            if (uploadedItems.length > 0) {
                const newMedia = [...uploadedMedia, ...uploadedItems]
                handleMediaIdsChange(newMedia)
                toast.success("Upload successful!", {
                    description: `${uploadedItems.length} image(s) have been uploaded.`,
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
                toast.error("Invalid files", {
                    description: "Please only drag and drop image files.",
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
        setSelectedIds(prev => {
            const updated = new Set(prev)
            updated.delete(mediaId)
            return updated
        })
        toast.success("Image removed")
    }

    const handleBulkDelete = () => {
        const newMedia = uploadedMedia.filter((m) => !selectedIds.has(m.id))
        handleMediaIdsChange(newMedia)
        setSelectedIds(new Set())
        toast.success(`${selectedIds.size} image(s) deleted`)
    }

    const toggleSelect = (mediaId: number) => {
        setSelectedIds(prev => {
            const updated = new Set(prev)
            if (updated.has(mediaId)) {
                updated.delete(mediaId)
            } else {
                updated.add(mediaId)
            }
            return updated
        })
    }

    const handleDragStart = (e: React.DragEvent, mediaId: number) => {
        setDraggedId(mediaId)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOverImage = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDropImage = (targetId: number) => {
        if (!draggedId || draggedId === targetId) return

        const draggedItem = uploadedMedia.find(m => m.id === draggedId)!
        const newMedia = uploadedMedia.filter(m => m.id !== draggedId) // 1. Xóa phần tử cũ

        const targetIndex = newMedia.findIndex(m => m.id === targetId)
        newMedia.splice(targetIndex, 0, draggedItem) // 2. Chèn vào vị trí đích

        handleMediaIdsChange(newMedia)
        setDraggedId(null)
    }

    const canAddMore = uploadedMedia.length < MAX_IMAGES
    const remainingSlots = MAX_IMAGES - uploadedMedia.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Product Gallery</h2>
                <p className="text-sm text-muted-foreground">
                    Manage product images. You can upload up to {MAX_IMAGES} images total.
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
                            <p className="text-sm font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    {isDragging ? "Drop images here" : "Drag & drop images here, or click to browse"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or WEBP (max 5MB each)</p>
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

            {/* Gallery Grid */}
            {uploadedMedia.length > 0 && (
                <div className="space-y-4">
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                            <p className="text-sm font-medium">{selectedIds.size} selected</p>
                            <Button
                                onClick={handleBulkDelete}
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Selected
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedMedia.map((media) => (
                            <div
                                key={media.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, media.id)}
                                onDragOver={handleDragOverImage}
                                onDrop={() => handleDropImage(media.id)}
                                className={`relative group cursor-move rounded-md border overflow-hidden transition-all ${
                                    selectedIds.has(media.id) ? 'ring-2 ring-primary border-primary' : 'border-input hover:border-primary'
                                } ${draggedId === media.id ? 'opacity-50' : ''}`}
                            >
                                <div className="relative w-full aspect-square bg-muted">
                                    <Image
                                        src={media.urlMedium || "/placeholder.svg?height=150&width=150"}
                                        alt="Gallery image"
                                        className="w-full h-full object-cover"
                                        width={150}
                                        height={150}
                                    />
                                </div>

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <GripVertical className="w-5 h-5 text-white" />
                                </div>

                                <button
                                    onClick={() => toggleSelect(media.id)}
                                    className="absolute top-2 left-2 w-5 h-5 rounded border-2 border-white bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center"
                                >
                                    {selectedIds.has(media.id) && (
                                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                                    )}
                                </button>

                                <Button
                                    onClick={() => handleRemoveImage(media.id)}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Status Messages */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            {!canAddMore ? (
                                <span className="font-medium">Maximum {MAX_IMAGES} images reached</span>
                            ) : (
                                <span>{remainingSlots} slot{remainingSlots > 1 ? "s" : ""} available</span>
                            )}
                        </div>
                        <span>{uploadedMedia.length} of {MAX_IMAGES}</span>
                    </div>
                </div>
            )}
        </div>
    )
}