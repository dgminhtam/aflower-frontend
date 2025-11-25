"use client"

import { MediaResponse } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { MediaFilter } from "./media-filter"
import { MediaList } from "./media-list"
import { MediaUploadDialog } from "./media-upload-dialog"

interface MediaViewProps {
    mediaPage: MediaResponse
    onDelete?: (id: number) => Promise<void> | void
    onBulkDelete?: (ids: number[]) => Promise<void> | void
}

export function MediaView({ mediaPage, onDelete, onBulkDelete }: MediaViewProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [droppedFiles, setDroppedFiles] = useState<File[]>([])

    // Handle Drag & Drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Only set false if leaving the main container, not entering a child
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files)
            // Filter for images/media if needed, for now accept all
            setDroppedFiles(files)
            setUploadDialogOpen(true)
            toast.info(`Received ${files.length} file(s). Please confirm upload.`)
        }
    }, [])

    return (
        <Card
            className="relative min-h-[600px]"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Drag Overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
                    <Upload className="h-16 w-16 text-primary mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-primary">Drop files here to upload</h3>
                </div>
            )}

            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                        <CardTitle>Media Library</CardTitle>
                        <CardDescription>
                            Manage all your images and media files.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <MediaFilter />
                        <MediaUploadDialog
                            open={uploadDialogOpen}
                            onOpenChange={setUploadDialogOpen}
                            droppedFiles={droppedFiles}
                        />
                    </div>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
                <MediaList
                    mediaPage={mediaPage}
                    onDelete={onDelete}
                    onBulkDelete={onBulkDelete}
                />
            </CardContent>
        </Card>
    )
}
