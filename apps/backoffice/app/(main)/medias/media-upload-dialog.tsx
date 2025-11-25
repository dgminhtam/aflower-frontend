"use client"

import { uploadMedia } from "@/app/api/medias/action"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { toast } from "sonner"

export function MediaUploadDialog({
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    droppedFiles
}: {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    droppedFiles?: File[]
}) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const isOpen = controlledOpen ?? internalOpen
    const setOpen = setControlledOpen ?? setInternalOpen

    // Handle dropped files from parent
    useEffect(() => {
        if (droppedFiles && droppedFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...droppedFiles])
            setOpen(true)
        }
    }, [droppedFiles, setOpen])

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (files: FileList) => {
        const newFiles = Array.from(files)
        setSelectedFiles((prev) => [...prev, ...newFiles])
    }

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const onUpload = async () => {
        if (selectedFiles.length === 0) return

        setIsUploading(true)
        try {
            let successCount = 0
            let failCount = 0

            for (const file of selectedFiles) {
                const formData = new FormData()
                formData.append("file", file)

                try {
                    await uploadMedia(formData)
                    successCount++
                } catch (error) {
                    console.error(error)
                    failCount++
                }
            }

            if (successCount > 0) {
                toast.success(`Successfully uploaded ${successCount} files.`)
                router.refresh()
                setOpen(false)
                setSelectedFiles([])
            }
            if (failCount > 0) {
                toast.error(`Failed to upload ${failCount} files.`)
            }

        } catch (error) {
            toast.error("Something went wrong during upload.")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(val) => {
            if (!val) setSelectedFiles([]) // Clear files on close? Maybe not if user accidentally closes.
            setOpen(val)
        }}>
            <DialogTrigger asChild>
                <Button id="media-upload-trigger">
                    <Upload className="mr-2 h-4 w-4" /> Upload Media
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                        Drag and drop files here or click to select files.
                    </DialogDescription>
                </DialogHeader>

                <div
                    className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600
                ${dragActive ? "border-primary bg-primary/10" : "border-gray-300"}
            `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                    </div>
                    <Input
                        ref={inputRef}
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleChange}
                        accept="image/*"
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                                <span className="truncate max-w-[300px]">{file.name}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>Cancel</Button>
                    <Button onClick={onUpload} disabled={selectedFiles.length === 0 || isUploading}>
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
