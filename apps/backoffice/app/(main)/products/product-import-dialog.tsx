"use client"

import { importProducts } from "@/app/api/products/action"
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
import { Upload, X, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

export function ProductImportDialog() {
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

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
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            toast.error("Vui lòng chọn file CSV.")
            return
        }
        setSelectedFile(file)
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const onUpload = async () => {
        if (!selectedFile) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", selectedFile)

            await importProducts(formData)

            toast.success("Import sản phẩm thành công.")
            router.refresh()
            setOpen(false)
            setSelectedFile(null)

        } catch (error) {
            toast.error("Có lỗi xảy ra khi import sản phẩm.")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setSelectedFile(null)
            setOpen(val)
        }}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <Upload className="mr-2 h-4 w-4" />
                    Nhập từ file CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nhập sản phẩm từ CSV</DialogTitle>
                    <DialogDescription>
                        Kéo thả file CSV vào đây hoặc click để chọn file.
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
                        <FileSpreadsheet className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click để tải lên</span> hoặc kéo thả</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">CSV file only</p>
                    </div>
                    <Input
                        ref={inputRef}
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept=".csv,text/csv"
                    />
                </div>

                {selectedFile && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <span className="truncate max-w-[300px]">{selectedFile.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeFile}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>Hủy</Button>
                    <Button onClick={onUpload} disabled={!selectedFile || isUploading}>
                        {isUploading ? "Đang xử lý..." : "Import"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
