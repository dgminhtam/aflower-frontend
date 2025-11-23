"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty"
import { Input } from "@workspace/ui/components/input"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { MediaSelector } from "./media-selector"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]

interface ImageUploadProps {
  value?: number | null
  initialMedia?: Media | null
  onChange?: (mediaId: number | undefined) => void
  onUploadSuccess?: (media: Media) => void
  error?: string
}

export function ImageUpload({ initialMedia, onChange, onUploadSuccess, error }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasUploadedInternally, setHasUploadedInternally] = useState(false)

  useEffect(() => {
    if (initialMedia && !hasUploadedInternally) {
      setImagePreview(initialMedia.urlMedium)
      setUploadedMedia(initialMedia)
    } else if (!initialMedia && !hasUploadedInternally) {
      setImagePreview(null)
      setUploadedMedia(null)
    }
  }, [initialMedia, hasUploadedInternally])

  useEffect(() => {
    if (error) {
      toast.error("Có lỗi xảy ra", {
        description: error,
      })
    }
  }, [error])

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return "File quá lớn. Kích thước tối đa là 5MB."
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Loại file không hợp lệ. Chỉ chấp nhận PNG, JPG, WEBP."
    }
    return null // Không có lỗi
  }

  const processFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      toast.error("File không hợp lệ", { description: validationError })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const media: Media = await uploadMedia(formData)
      setImagePreview(media.urlMedium)
      setUploadedMedia(media)
      onChange?.(media.id)
      onUploadSuccess?.(media)
      setHasUploadedInternally(true)
      toast.success("Upload thành công!", {
        description: `File ${file.name} đã được tải lên.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      toast.error("Upload thất bại", {
        description: errorMessage,
      })
      setImagePreview(initialMedia?.urlMedium || null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
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
      const file = files[0]

      if (file && file.type.startsWith("image/")) {
        // Update input file manually to keep it in sync (optional but good for UX if they click again)
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          fileInputRef.current.files = dataTransfer.files
        }
        processFile(file)
      } else {
        toast.error("File không hợp lệ", {
          description: "Vui lòng chỉ thả file hình ảnh.",
        })
      }
    }
  }

  const handleClearImage = () => {
    setImagePreview(null)
    setUploadedMedia(null)
    onChange?.(undefined)
    setHasUploadedInternally(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSelectMedia = (media: Media) => {
    setImagePreview(media.urlMedium)
    setUploadedMedia(media)
    onChange?.(media.id)
    setHasUploadedInternally(true)
  }

  return (
    <div className="space-y-2">
      <div className="space-y-3">
        {imagePreview ? (
          <div className="relative w-full max-w-xs group">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt={uploadedMedia?.name || "Uploaded image"}
              className="w-full object-cover rounded-lg border border-input"
              width={300}
              height={300}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            {!isLoading && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MediaSelector onSelect={handleSelectMedia}>
                  <Button variant="secondary" size="icon" className="rounded-full h-8 w-8" type="button">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </MediaSelector>
                <Button
                  onClick={handleClearImage}
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Empty
              onClick={() => !isLoading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer border border-dashed hover:bg-muted/50 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-56 ${isDragging ? "bg-muted border-primary border-2" : ""
                }`}
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
                <Button variant="outline" type="button" className="w-full">
                  <ImageIcon className="mr-2 h-4 w-4" /> Chọn từ thư viện
                </Button>
              </MediaSelector>
            </div>
          </div>
        )}
        <Input ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleImageChange}
          disabled={isLoading}
          className="hidden" />
      </div>
    </div>
  )
}
