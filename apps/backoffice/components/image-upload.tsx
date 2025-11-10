"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty"
import { Input } from "@workspace/ui/components/input"
import { uploadMedia } from "@/app/lib/media/action"
import { Media } from "@/app/lib/categories/definitions"

interface ImageUploadProps {
  value?: number | null
  initialMedia?: Media | null
  onChange?: (mediaId: number | undefined) => void
  onUploadSuccess?: (media: Media) => void
  error?: string
}

export function ImageUpload({ value, initialMedia, onChange, onUploadSuccess, error }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
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
      setUploadError("")
    }
  }, [initialMedia, hasUploadedInternally])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)

    setIsLoading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const media: Media = await uploadMedia(formData)
      setImagePreview(media.urlMedium)
      setUploadedMedia(media)
      onChange?.(media.id)
      onUploadSuccess?.(media)
      setHasUploadedInternally(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setUploadError(errorMessage)
      setImagePreview(initialMedia?.urlMedium || null)
    } finally {
      setIsLoading(false)
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
      const file = files[0]
      if (file != undefined && file.type.startsWith("image/")) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current!.files = dataTransfer.files
        handleImageChange({
          target: { files: dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>)
      } else {
        setUploadError("Please drop an image file")
      }
    }
  }

  const handleClearImage = () => {
    setImagePreview(null)
    setUploadedMedia(null)
    setUploadError("")
    onChange?.(undefined)
    setHasUploadedInternally(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>Hình ảnh</Label>
      <div className="space-y-3">
        {imagePreview ? (
          <div className="relative w-full max-w-xs">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-input shadow-sm"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            {!isLoading && (
              <Button
                onClick={handleClearImage}
                variant={"outline"}
                size="icon"
                className="absolute top-2 right-2 cursor-pointer rounded-full"
              >
                <X />
              </Button>
            )}
          </div>
        ) : (
          <Empty
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer border border-dashed hover:bg-muted/50 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-56 ${
              isDragging ? "bg-muted border-primary border-2" : ""
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
        )}
        <Input ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
          className="hidden" />
      </div>

      {uploadedMedia && hasUploadedInternally && (
        <div className="mt-4 p-4 bg-muted rounded-lg space-y-2 text-sm">
          <p className="font-medium text-foreground">Upload thành công!</p>
          <div className="space-y-1 text-muted-foreground">
            <p>ID: {uploadedMedia.id}</p>
            <p>Alt Text: {uploadedMedia.altText}</p>
            <p className="break-all">URL: {uploadedMedia.urlOriginal}</p>
          </div>
        </div>
      )}

      {(error || uploadError) && <p className="text-sm text-destructive">{error || uploadError}</p>}
    </div>
  )
}
