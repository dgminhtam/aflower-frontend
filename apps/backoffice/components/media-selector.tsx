"use client"

import { getMedias } from "@/app/api/medias/action"
import { Media, MediaResponse } from "@/app/lib/media/definitions"
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Check, Image as ImageIcon, Loader2, Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useCallback } from "react"

function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

interface MediaSelectorProps {
    onSelect: (media: Media) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export function MediaSelector({ onSelect, children }: MediaSelectorProps) {
    const [open, setOpen] = useState(false)
    const [medias, setMedias] = useState<Media[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const debouncedSearch = useDebounceValue(search, 500)

    const fetchMedias = useCallback(async () => {
        setLoading(true)
        try {
            const res: MediaResponse = await getMedias({
                page: page,
                size: 20,
                filter: debouncedSearch ? `containsIgnoreCase(name, '${debouncedSearch}')` : "",
                sort: [{ field: "id", direction: "desc" }]
            })
            setMedias(res.content)
            setTotalPages(res.totalPages)
        } catch (error) {
            console.error("Failed to fetch medias", error)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch])

    useEffect(() => {
        if (open) {
            fetchMedias()
        }
    }, [open, fetchMedias])

    const handleSelect = (media: Media) => {
        setSelectedId(media.id)
        onSelect(media)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button variant="outline">Chọn từ thư viện</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chọn Media</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 py-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="flex-1 border rounded-md p-4 overflow-y-auto">
                    {loading && medias.length === 0 ? (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : medias.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {medias.map((media) => (
                                <div
                                    key={media.id}
                                    className={`group relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all ${selectedId === media.id ? "ring-2 ring-primary" : ""}`}
                                    onClick={() => handleSelect(media)}
                                >
                                    <Image
                                        src={media.urlThumbnail || media.urlMedium || "/placeholder.webp"}
                                        alt={media.name || media.altText || "Media"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    {selectedId === media.id && (
                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                        {media.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                            <p>Không tìm thấy media nào.</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0 || loading}
                    >
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {page + 1} / {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1 || loading}
                    >
                        Sau
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
