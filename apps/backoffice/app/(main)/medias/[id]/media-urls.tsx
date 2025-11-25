"use client"

import { Media } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export function MediaUrls({ media }: { media: Media }) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Đã sao chép liên kết!")
    }

    const urls = [
        { label: "Gốc (Original)", value: media.urlOriginal },
        { label: "Lớn (Large)", value: media.urlLarge },
        { label: "Trung bình (Medium)", value: media.urlMedium },
        { label: "Nhỏ (Thumbnail)", value: media.urlThumbnail },
    ].filter(u => u.value)

    return (
        <div className="space-y-4">
            <span className="text-sm font-medium text-muted-foreground">Các phiên bản URL</span>
            {urls.map((url, index) => (
                <div key={index} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{url.label}</Label>
                    <div className="flex items-center gap-2">
                        <Input readOnly value={url.value} className="h-8 text-xs font-mono" />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => copyToClipboard(url.value)}
                            title="Sao chép"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
