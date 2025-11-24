"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty"
import { Input } from "@workspace/ui/components/input"
import { ChevronLeft, ChevronRight, GripVertical, Image as ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { MediaSelector } from "./media-selector"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]

interface GalleryUploadProps {
    initialMedia?: Media[]
    onChange?: (mediaIds: number[]) => void
    onUploadSuccess?: (medias: Media[]) => void
    error?: string
    maxFiles?: number
    disabled?: boolean
}

export function GalleryUpload({
    initialMedia = [],
    onChange,
    onUploadSuccess,
    error,
    maxFiles = 10,
    disabled = false,
}: GalleryUploadProps) {
    const [medias, setMedias] = useState<Media[]>(initialMedia)
    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [draggedId, setDraggedId] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewMedia, setPreviewMedia] = useState<Media | null>(null)
    const [previewIndex, setPreviewIndex] = useState<number>(0)

    useEffect(() => {
        if (initialMedia && initialMedia.length > 0) {
            setMedias(initialMedia)
        }
    }, [])

    useEffect(() => {
        if (error) {
            toast.error("Có lỗi xảy ra", {
                description: error,
            })
        }
    }, [error])

    const updateMedias = (newMedias: Media[]) => {
        setMedias(newMedias)
        onChange?.(newMedias.map((m) => m.id))
    }

    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            return `File ${file.name} quá lớn. Kích thước tối đa là 5MB.`
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `File ${file.name} không hợp lệ. Chỉ chấp nhận PNG, JPG, WEBP.`
        }
        return null
    }

    const processFiles = async (files: File[]) => {
        if (disabled) return

        const validFiles: File[] = []
        const errors: string[] = []

        if (maxFiles && medias.length + files.length > maxFiles) {
            toast.error(`Chỉ được phép tải lên tối đa ${maxFiles} ảnh.`)
            return
        }

        files.forEach((file) => {
            const error = validateFile(file)
            if (error) {
                errors.push(error)
            } else {
                validFiles.push(file)
            }
        })

        if (errors.length > 0) {
            errors.forEach((err) => toast.error(err))
        }

        if (validFiles.length === 0) return

        setIsLoading(true)
        const uploaded: Media[] = []

        try {
            await Promise.all(
                validFiles.map(async (file) => {
                    const formData = new FormData()
                    formData.append("file", file)
                    const media = await uploadMedia(formData)
                    uploaded.push(media)
                })
            )

            const newMedias = [...medias, ...uploaded]
            updateMedias(newMedias)
            onUploadSuccess?.(uploaded)
            toast.success(`Đã tải lên ${uploaded.length} ảnh thành công!`)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Upload failed"
            toast.error("Upload thất bại", {
                description: errorMessage,
            })
        } finally {
            setIsLoading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        await processFiles(files)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (disabled) return

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const imageFiles = files.filter((file) => file.type.startsWith("image/"))
            if (imageFiles.length !== files.length) {
                toast.warning("Một số file không phải là ảnh đã bị bỏ qua.")
            }
            await processFiles(imageFiles)
        }
    }

    const handleRemoveMedia = (id: number) => {
        if (disabled) return
        const newMedias = medias.filter((m) => m.id !== id)
        updateMedias(newMedias)

        const newSelected = new Set(selectedIds)
        newSelected.delete(id)
        setSelectedIds(newSelected)
    }

    const handleSelectMedia = (media: Media) => {
        if (disabled) return
        if (medias.some((m) => m.id === media.id)) {
            toast.info("Ảnh này đã có trong danh sách.")
            return
        }
        if (maxFiles && medias.length >= maxFiles) {
            toast.error(`Đã đạt giới hạn ${maxFiles} ảnh.`)
            return
        }
        const newMedias = [...medias, media]
        updateMedias(newMedias)
    }

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleBulkDelete = () => {
        if (disabled) return
        const newMedias = medias.filter((m) => !selectedIds.has(m.id))
        updateMedias(newMedias)
        setSelectedIds(new Set())
    }

    // Drag and Drop Reordering
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        if (disabled) return
        setDraggedId(id)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDropImage = (targetId: number) => {
        if (disabled || draggedId === null || draggedId === targetId) return

        const draggedIndex = medias.findIndex((m) => m.id === draggedId)
        const targetIndex = medias.findIndex((m) => m.id === targetId)

        if (draggedIndex === -1 || targetIndex === -1) return

        const newMedias = [...medias]
        const [draggedItem] = newMedias.splice(draggedIndex, 1)

        if (draggedItem) {
            newMedias.splice(targetIndex, 0, draggedItem)
            updateMedias(newMedias)
        }
        setDraggedId(null)
    }

    const canAddMore = !maxFiles || medias.length < maxFiles
    // Preview handlers
    const handleOpenPreview = (media: Media) => {
        const index = medias.findIndex((m) => m.id === media.id)
        setPreviewMedia(media)
        setPreviewIndex(index)
    }
    const handleClosePreview = () => {
        setPreviewMedia(null)
    }
    const handleNextImage = () => {
        if (medias.length === 0) return
        const nextIndex = (previewIndex + 1) % medias.length
        setPreviewIndex(nextIndex)
        const nextMedia = medias[nextIndex]
        if (nextMedia) setPreviewMedia(nextMedia)
    }
    const handlePreviousImage = () => {
        if (medias.length === 0) return
        const prevIndex = (previewIndex - 1 + medias.length) % medias.length
        setPreviewIndex(prevIndex)
        const prevMedia = medias[prevIndex]
        if (prevMedia) setPreviewMedia(prevMedia)
    }
    // Keyboard shortcuts for preview
    useEffect(() => {
        if (!previewMedia) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                e.preventDefault()
                handleNextImage()
            } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                handlePreviousImage()
            } else if (e.key === "Escape") {
                e.preventDefault()
                handleClosePreview()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [previewMedia, previewIndex, medias])
    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {canAddMore && (
                <div className="space-y-2">
                    <Empty
                        onClick={() => !isLoading && !disabled && fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`cursor-pointer border border-dashed hover:bg-muted/50 hover:border-primary transition-colors min-h-40 ${isDragging ? "bg-muted border-primary border-2" : ""
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? (
                            <EmptyContent>
                                <EmptyMedia>
                                    <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                                </EmptyMedia>
                                <EmptyTitle>Đang tải lên...</EmptyTitle>
                            </EmptyContent>
                        ) : (
                            <EmptyContent>
                                <EmptyMedia variant="icon">
                                    <Upload />
                                </EmptyMedia>
                                <EmptyHeader>
                                    <EmptyTitle>{isDragging ? "Thả để tải lên" : "Nhấp để tải lên hoặc kéo thả"}</EmptyTitle>
                                    <EmptyDescription>PNG, JPG, WEBP (tối đa 5MB)</EmptyDescription>
                                </EmptyHeader>
                            </EmptyContent>
                        )}
                    </Empty>

                    <div className="flex justify-center">
                        <MediaSelector onSelect={handleSelectMedia}>
                            <Button variant="outline" type="button" className="w-full" disabled={disabled || isLoading}>
                                <ImageIcon className="mr-2 h-4 w-4" /> Chọn từ thư viện
                            </Button>
                        </MediaSelector>
                    </div>

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={handleFileChange}
                        disabled={isLoading || disabled}
                        multiple
                        className="hidden"
                    />
                </div>
            )}

            {/* Gallery Grid */}
            {medias.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Bulk Actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-muted">
                            <span className="text-sm font-medium px-2">{selectedIds.size} đã chọn</span>
                            <Button
                                onClick={handleBulkDelete}
                                variant="destructive"
                                size="sm"
                                className="gap-2 h-8"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" /> Xóa đã chọn
                            </Button>
                        </div>
                    )}

                    {/* Image List */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {medias.map((media) => {
                            const isSelected = selectedIds.has(media.id)
                            const isBeingDragged = draggedId === media.id

                            return (
                                <div
                                    key={media.id}
                                    draggable={!disabled}
                                    onDragStart={(e) => handleDragStart(e, media.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDropImage(media.id)}
                                    onClick={(e) => {
                                        // Không mở preview nếu click vào button/checkbox
                                        if ((e.target as HTMLElement).closest('button')) return
                                        handleOpenPreview(media)
                                    }}
                                    className={`
                    relative group aspect-square rounded-lg border overflow-hidden bg-background transition-all duration-200 cursor-pointer
                    ${isSelected ? "ring-2 ring-primary border-primary shadow-sm" : "border-input hover:border-primary/50"}
                    ${isBeingDragged ? "opacity-40 scale-95 grayscale" : "opacity-100"}
                  `}
                                >
                                    <Image
                                        src={media.urlMedium || "/placeholder.svg"}
                                        alt={media.name || "Product image"}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        className="object-cover"
                                    />

                                    {/* Controls Overlay */}
                                    {!disabled && (
                                        <>
                                            {/* Drag Handle */}
                                            <div
                                                className={`
                          absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity flex items-center justify-center cursor-move
                          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        `}
                                            >
                                                <GripVertical className="w-6 h-6 text-white/90 drop-shadow-md" />
                                            </div>

                                            {/* Select Checkbox */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleSelect(media.id)
                                                }}
                                                className={`
                          absolute top-2 left-2 w-6 h-6 rounded border shadow-sm flex items-center justify-center transition-all
                          ${isSelected
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "bg-black/40 border-white/50 hover:bg-black/60"
                                                    }
                        `}
                                            >
                                                {isSelected && <span className="text-xs font-bold">✓</span>}
                                            </button>

                                            {/* Delete Button */}
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveMedia(media.id)
                                                }}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </>
                                    )}
                                    {/* Image Preview Dialog */}
                                    <Dialog open={!!previewMedia} onOpenChange={(open) => { if (!open) handleClosePreview() }}>
                                        <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] p-0" showCloseButton={false}>
                                            {previewMedia && (
                                                <div className="relative w-full h-full flex flex-col bg-black">
                                                    {/* Header */}
                                                    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
                                                        <div className="text-white">
                                                            <p className="font-medium">{previewMedia.name}</p>
                                                            <p className="text-sm text-white/70">
                                                                {previewIndex + 1} / {medias.length}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={handleClosePreview}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-white hover:bg-white/20"
                                                            type="button"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                    {/* Image Container */}
                                                    <div className="relative flex-1 flex items-center justify-center p-12">
                                                        <Image
                                                            src={previewMedia.urlLarge || previewMedia.urlMedium || "/placeholder.svg"}
                                                            alt={previewMedia.name || "Preview"}
                                                            fill
                                                            className="object-contain"
                                                            sizes="90vw"
                                                            priority
                                                        />
                                                    </div>
                                                    {/* Navigation Controls */}
                                                    {medias.length > 1 && (
                                                        <>
                                                            <Button
                                                                onClick={handlePreviousImage}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                                                                type="button"
                                                            >
                                                                <ChevronLeft className="h-8 w-8" />
                                                            </Button>
                                                            <Button
                                                                onClick={handleNextImage}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                                                                type="button"
                                                            >
                                                                <ChevronRight className="h-8 w-8" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}