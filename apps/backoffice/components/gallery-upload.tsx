"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent, DialogTitle } from "@workspace/ui/components/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty"
import { Input } from "@workspace/ui/components/input"
import { ChevronLeft, ChevronRight, GripVertical, Image as ImageIcon, Loader2, X, Upload } from "lucide-react"
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

interface UploadingFile {
    id: string
    file: File
    previewUrl: string
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
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [draggedId, setDraggedId] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewMedia, setPreviewMedia] = useState<Media | null>(null)
    const [previewIndex, setPreviewIndex] = useState<number>(0)
    const prevInitialMediaRef = useRef(initialMedia)

    useEffect(() => {
        if (JSON.stringify(prevInitialMediaRef.current) !== JSON.stringify(initialMedia)) {
            setMedias(initialMedia || [])
            prevInitialMediaRef.current = initialMedia
        }
    }, [initialMedia])

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

        if (maxFiles && medias.length + files.length + uploadingFiles.length > maxFiles) {
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

        // Create optimistic items
        const newUploadingFiles = validFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
        }))

        setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

        const uploaded: Media[] = []

        try {
            await Promise.all(
                newUploadingFiles.map(async (uploadingFile) => {
                    try {
                        const formData = new FormData()
                        formData.append("file", uploadingFile.file)
                        const media = await uploadMedia(formData)
                        uploaded.push(media)
                    } catch (error) {
                        console.error(`Failed to upload ${uploadingFile.file.name}`, error)
                        toast.error(`Không thể tải lên ${uploadingFile.file.name}`)
                    } finally {
                        // Remove from uploading state regardless of success/failure
                        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id))
                        URL.revokeObjectURL(uploadingFile.previewUrl)
                    }
                })
            )

            if (uploaded.length > 0) {
                const newMedias = [...medias, ...uploaded]
                updateMedias(newMedias)
                onUploadSuccess?.(uploaded)
                toast.success(`Đã tải lên ${uploaded.length} ảnh thành công!`)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Upload failed"
            toast.error("Upload thất bại", {
                description: errorMessage,
            })
        } finally {
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

    const canAddMore = !maxFiles || medias.length + uploadingFiles.length < maxFiles
    const isLoading = uploadingFiles.length > 0

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
                        onClick={() => !disabled && fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`cursor-pointer border border-dashed hover:bg-muted/50 hover:border-primary transition-all duration-200 min-h-40 ${isDragging ? "bg-muted border-primary border-2 scale-[0.99]" : ""
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <EmptyContent>
                            <EmptyMedia variant="icon">
                                <Upload className={isDragging ? "animate-bounce" : ""} />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle>{isDragging ? "Thả để tải lên" : "Nhấp để tải lên hoặc kéo thả"}</EmptyTitle>
                                <EmptyDescription>PNG, JPG, WEBP (tối đa 5MB)</EmptyDescription>
                            </EmptyHeader>
                        </EmptyContent>
                    </Empty>

                    <div className="flex justify-center">
                        <MediaSelector onSelect={handleSelectMedia}>
                            <Button variant="outline" type="button" className="w-full" disabled={disabled}>
                                <ImageIcon className="mr-2 h-4 w-4" /> Chọn từ thư viện
                            </Button>
                        </MediaSelector>
                    </div>

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={handleFileChange}
                        disabled={disabled}
                        multiple
                        className="hidden"
                    />
                </div>
            )}

            {/* Gallery Grid */}
            {(medias.length > 0 || uploadingFiles.length > 0) && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Image List */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Existing Medias */}
                        {medias.map((media) => {
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
                    border-input hover:border-primary/50 hover:shadow-md
                    ${isBeingDragged ? "opacity-40 scale-95 grayscale" : "opacity-100 hover:scale-[1.02]"}
                  `}
                                >
                                    <Image
                                        src={media.urlMedium || "/placeholder.svg"}
                                        alt={media.name || "Product image"}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Controls Overlay */}
                                    {!disabled && (
                                        <>
                                            {/* Drag Handle */}
                                            <div
                                                className={`
                          absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity flex items-center justify-center cursor-move
                          opacity-0 group-hover:opacity-100
                        `}
                                            >
                                                <GripVertical className="w-6 h-6 text-white/90 drop-shadow-md" />
                                            </div>

                                            {/* Delete Button */}
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveMedia(media.id)
                                                }}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:scale-110"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )
                        })}

                        {/* Uploading Files (Optimistic UI) */}
                        {uploadingFiles.map((file) => (
                            <div
                                key={file.id}
                                className="relative aspect-square rounded-lg border overflow-hidden bg-muted animate-pulse"
                            >
                                <Image
                                    src={file.previewUrl}
                                    alt="Uploading..."
                                    fill
                                    className="object-cover opacity-50"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                    <span className="text-xs font-medium text-white drop-shadow-md">Đang tải lên...</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Preview Dialog */}
            <Dialog open={!!previewMedia} onOpenChange={(open) => { if (!open) handleClosePreview() }}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-transparent border-none shadow-none" showCloseButton={false}>
                    {previewMedia && (
                        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                            {/* Accessible Title */}
                            <div className="sr-only">
                                <DialogTitle>{previewMedia.name}</DialogTitle>
                            </div>

                            {/* Backdrop & Close Area */}
                            <div
                                className="absolute inset-0 pointer-events-auto"
                                onClick={handleClosePreview}
                            />

                            {/* Main Image Container */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                                <div className="relative w-full h-full max-w-7xl max-h-[90vh] pointer-events-auto">
                                    <Image
                                        src={previewMedia.urlLarge || previewMedia.urlMedium || "/placeholder.svg"}
                                        alt={previewMedia.name || "Preview"}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        sizes="95vw"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Top Bar Controls */}
                            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/10">
                                    {previewMedia.name} <span className="text-white/50 mx-2">|</span> {previewIndex + 1} / {medias.length}
                                </div>
                                <Button
                                    onClick={handleClosePreview}
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md shadow-lg"
                                    type="button"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Navigation Controls */}
                            {medias.length > 1 && (
                                <>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handlePreviousImage()
                                        }}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/40 hover:bg-black/60 h-12 w-12 rounded-full backdrop-blur-md border border-white/20 shadow-xl transition-all pointer-events-auto"
                                        type="button"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleNextImage()
                                        }}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/40 hover:bg-black/60 h-12 w-12 rounded-full backdrop-blur-md border border-white/20 shadow-xl transition-all pointer-events-auto"
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
}