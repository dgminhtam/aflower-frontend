"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import type { Media } from "@/app/lib/admin/categories/definitions"
import { uploadMedia } from "@/app/lib/admin/categories/data"

interface ImageUploadProps {
  value?: string | number | null
  onChange?: (media: Media) => void
  onUploadSuccess?: (media: Media) => void
  error?: string
}

export function ImageUpload({ value, onChange, onUploadSuccess, error }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setUploadedMedia(media)
      onChange?.(media)
      onUploadSuccess?.(media)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setUploadError(errorMessage)
      setImagePreview(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearImage = () => {
    setImagePreview(null)
    setUploadedMedia(null)
    setUploadError("")
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
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-10 h-10 text-muted-foreground mb-3 animate-spin" />
                <p className="text-sm font-medium text-foreground">Đang tải lên...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Nhấp để tải lên hoặc kéo thả</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (tối đa 5MB)</p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
          className="hidden"
        />
      </div>

      {uploadedMedia && (
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