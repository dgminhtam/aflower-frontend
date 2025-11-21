"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { GripVertical, Loader2, Trash2, Upload, X } from 'lucide-react'
import Image from "next/image"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

// --- Constants ---
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_IMAGES = 10

// --- Types ---
interface ProductGalleryProps {
    value?: number[]
    onChange: (mediaIds: number[]) => void
    onBlur?: () => void;
    disabled?: boolean;
    initialMedias?: Media[]
}

export function ProductGallery({
    value,
    onChange,
    onBlur,
    disabled,
    initialMedias = []
}: ProductGalleryProps) {
    // --- State ---
    const [uploadedMedia, setUploadedMedia] = useState<Media[]>(initialMedias)
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [draggedId, setDraggedId] = useState<number | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // --- Synchronization Logic ---
    // Sync initialMedias khi Parent thay đổi dữ liệu, nhưng tránh override khi đang upload
    useEffect(() => {
        if (isUploading) return;

        const currentIds = uploadedMedia.map(m => m.id).join(',');
        const initialIds = initialMedias.map(m => m.id).join(',');

        if (currentIds !== initialIds) {
            setUploadedMedia(initialMedias);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialMedias]); // Chỉ chạy khi initialMedias thay đổi thực sự

    // Helper update parent
    const updateParent = (newMedia: Media[]) => {
        setUploadedMedia(newMedia)
        onChange(newMedia.map((m) => m.id))
    }

    // --- Validation ---
    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) return "File is too large. Maximum size is 5MB."
        if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type. Only PNG, JPG, and WEBP are accepted."
        return null
    }

    // --- Core Upload Logic ---
    const handleUploadFiles = async (files: File[]) => {
        if (files.length === 0) return

        // Check limit
        if (uploadedMedia.length + files.length > MAX_IMAGES) {
            toast.error("Upload limit exceeded", {
                description: `You can upload a maximum of ${MAX_IMAGES} images.`,
            })
            return
        }

        setIsUploading(true)

        try {
            // Xử lý song song nhưng không fail toàn bộ nếu 1 ảnh lỗi
            const uploadPromises = files.map(async (file) => {
                const error = validateFile(file)
                if (error) throw new Error(error)

                const formData = new FormData()
                formData.append("file", file)
                return await uploadMedia(formData)
            })

            const results = await Promise.allSettled(uploadPromises)

            const successfulUploads: Media[] = []
            const errors: string[] = []

            results.forEach((result) => {
                if (result.status === 'fulfilled') {
                    // Đảm bảo server action trả về data hợp lệ
                    if (result.value) successfulUploads.push(result.value)
                } else {
                    errors.push(result.reason.message || "Upload failed")
                }
            })

            // Update state nếu có ảnh thành công
            if (successfulUploads.length > 0) {
                const newMedia = [...uploadedMedia, ...successfulUploads]
                updateParent(newMedia)
                toast.success(`Successfully uploaded ${successfulUploads.length} image(s)`)
            }

            // Thông báo lỗi nếu có
            if (errors.length > 0) {
                toast.error(`${errors.length} file(s) failed to upload`, {
                    description: errors[0]
                })
            }

        } catch (err) {
            console.error(err)
            toast.error("Something went wrong during upload")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    // --- Event Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        handleUploadFiles(files)
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) setIsDragging(true)
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (disabled) return

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"))
        handleUploadFiles(files)
    }, [disabled, uploadedMedia.length])

    // --- Action Handlers (Delete/Select) ---
    const handleRemoveImage = (mediaId: number) => {
        const newMedia = uploadedMedia.filter((m) => m.id !== mediaId)
        updateParent(newMedia)

        // Xóa khỏi danh sách đang chọn nếu có
        if (selectedIds.has(mediaId)) {
            const newSelected = new Set(selectedIds)
            newSelected.delete(mediaId)
            setSelectedIds(newSelected)
        }
    }

    const handleBulkDelete = () => {
        const newMedia = uploadedMedia.filter((m) => !selectedIds.has(m.id))
        updateParent(newMedia)
        setSelectedIds(new Set())
        toast.success("Selected images deleted")
    }

    const toggleSelect = (mediaId: number) => {
        setSelectedIds(prev => {
            const updated = new Set(prev)
            updated.has(mediaId) ? updated.delete(mediaId) : updated.add(mediaId)
            return updated
        })
    }

    // --- Sort Logic (Native Drag) ---
    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDropImage = (targetId: number) => {
        if (!draggedId || draggedId === targetId) return

        const draggedIndex = uploadedMedia.findIndex(m => m.id === draggedId)
        const targetIndex = uploadedMedia.findIndex(m => m.id === targetId)

        if (draggedIndex === -1 || targetIndex === -1) return

        const newMedia = [...uploadedMedia]
        const [reorderedItem] = newMedia.splice(draggedIndex, 1)
        if (!reorderedItem) return
        newMedia.splice(targetIndex, 0, reorderedItem)

        updateParent(newMedia)
        setDraggedId(null)
    }

    const canAddMore = uploadedMedia.length < MAX_IMAGES

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Product Gallery</h2>
                <p className="text-sm text-muted-foreground">
                    Manage product images. ({uploadedMedia.length}/{MAX_IMAGES})
                </p>
            </div>

            {/* Upload Dropzone */}
            {canAddMore && !disabled && (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all outline-none
                        ${isDragging
                            ? "border-primary bg-primary/5 scale-[1.01]"
                            : "border-border hover:border-primary hover:bg-muted/25"
                        }
                        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    `}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                            <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                            <p className="text-sm font-medium text-muted-foreground">Uploading media...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 rounded-full bg-muted">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Click or drag images here</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, WEBP (max 5MB)
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
                onChange={handleInputChange}
                onBlur={onBlur} // Gắn onBlur để form validation hoạt động đúng
                disabled={isUploading || !canAddMore || disabled}
                multiple
                className="hidden"
            />

            {/* Gallery Grid */}
            {uploadedMedia.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Bulk Actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-muted">
                            <span className="text-sm font-medium px-2">{selectedIds.size} selected</span>
                            <Button
                                onClick={handleBulkDelete}
                                variant="destructive"
                                size="sm"
                                className="gap-2 h-8"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Selected
                            </Button>
                        </div>
                    )}

                    {/* Image List */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedMedia.map((media) => {
                            const isSelected = selectedIds.has(media.id);
                            const isBeingDragged = draggedId === media.id;

                            return (
                                <div
                                    key={media.id}
                                    draggable={!disabled}
                                    onDragStart={(e) => handleDragStart(e, media.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDropImage(media.id)}
                                    className={`
                                        relative group aspect-square rounded-lg border overflow-hidden bg-background transition-all duration-200
                                        ${isSelected ? 'ring-2 ring-primary border-primary shadow-sm' : 'border-input hover:border-primary/50'}
                                        ${isBeingDragged ? 'opacity-40 scale-95 grayscale' : 'opacity-100'}
                                    `}
                                >
                                    <Image
                                        src={media.urlMedium || "/placeholder.svg"}
                                        alt="Product image"
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        className="object-cover"
                                    />

                                    {/* Controls Overlay */}
                                    {!disabled && (
                                        <>
                                            {/* Drag Handle */}
                                            <div className={`
                                                absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity flex items-center justify-center cursor-move
                                                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                            `}>
                                                <GripVertical className="w-6 h-6 text-white/90 drop-shadow-md" />
                                            </div>

                                            {/* Select Checkbox */}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); toggleSelect(media.id); }}
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
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(media.id); }}
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}