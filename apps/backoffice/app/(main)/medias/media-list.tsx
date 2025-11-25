"use client"

import { Media, MediaResponse } from "@/app/lib/media/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@workspace/ui/components/table"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  Copy,
  ExternalLink,
  Grid,
  List,
  MoreHorizontal,
  Trash,
  Upload,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface MediaListProps {
  mediaPage: MediaResponse
  onDelete?: (id: number) => Promise<void> | void
  onBulkDelete?: (ids: number[]) => Promise<void> | void
}

export function MediaList({ mediaPage, onDelete, onBulkDelete }: MediaListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [lightboxMedia, setLightboxMedia] = useState<Media | null>(null)

  const medias = mediaPage.content;
  const router = useRouter()

  // Selection Logic
  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === medias.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(medias.map(m => m.id)))
    }
  }

  // Actions
  const handleDelete = async () => {
    if (!deleteId && selectedIds.size === 0) return

    setIsDeleting(true)
    try {
      if (deleteId && deleteId !== -1) {
        await onDelete?.(deleteId)
        setDeleteId(null)
      } else {
        await onBulkDelete?.(Array.from(selectedIds))
        setSelectedIds(new Set())
        setDeleteId(null)
      }
      toast.success("Deleted successfully!")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred while deleting.")
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Link copied!")
  }

  return (
    <div className="w-full relative min-h-[500px]">
      {/* Header Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-2">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Total <strong>{mediaPage.totalElements}</strong> items
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-5">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteId(-1)} // -1 triggers bulk delete confirmation
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete {selectedIds.size} items
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </div>
          )}
        </div>

        <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as "list" | "grid")} variant="outline">
          <ToggleGroupItem value="list" aria-label="Toggle list">
            <List className="h-4 w-4 mr-2" /> List
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Toggle grid">
            <Grid className="h-4 w-4 mr-2" /> Grid
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* VIEW MODE: LIST */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          <Card className="border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[40px] pl-4">
                    <Checkbox
                      checked={selectedIds.size === medias.length && medias.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[80px] font-semibold text-foreground">ID</TableHead>
                  <TableHead className="w-[100px] font-semibold text-foreground">Preview</TableHead>
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Url</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Size</TableHead>
                  <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medias.length > 0 ? (
                  medias.map((media) => (
                    <TableRow key={media.id} className="border-border hover:bg-muted/50 transition-colors group">
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={selectedIds.has(media.id)}
                          onCheckedChange={() => toggleSelect(media.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {media.id}
                      </TableCell>
                      <TableCell>
                        <div
                          className="relative h-12 w-12 rounded overflow-hidden border bg-muted cursor-pointer hover:ring-2 ring-primary transition-all"
                          onClick={() => setLightboxMedia(media)}
                        >
                          <Image
                            src={media?.urlThumbnail || "/placeholder.webp"}
                            alt={media.altText || "Media image"}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[200px]" title={media.name}>{media.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[300px]">
                          <div className="truncate text-sm text-muted-foreground flex-1" title={media.urlOriginal}>
                            {media.urlOriginal}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(media.urlOriginal)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-foreground font-semibold">
                        {media.size ? (media.size / 1024).toFixed(1) + ' KB' : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLightboxMedia(media)}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Quick View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(media.urlOriginal)}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/medias/${media.id}`} className="flex items-center">
                                <ExternalLink className="mr-2 h-4 w-4" /> Full Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteId(media.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No medias found</p>
                        <p className="text-sm text-muted-foreground">Upload new media to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        /* VIEW MODE: GRID */
        <div className="space-y-4">
          {medias.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {medias.map((media) => (
                <Card
                  key={media.id}
                  className={`group relative overflow-hidden rounded-lg border transition-all ${selectedIds.has(media.id) ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'}`}
                >
                  <div className="absolute top-2 left-2 z-20">
                    <Checkbox
                      checked={selectedIds.has(media.id)}
                      onCheckedChange={() => toggleSelect(media.id)}
                      className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  </div>

                  <div className="relative aspect-square bg-muted cursor-pointer" onClick={() => setLightboxMedia(media)}>
                    <Image
                      src={media.urlMedium || media.urlThumbnail || "/placeholder.webp"}
                      alt={media.altText || "Media"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    {/* Overlay Actions on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => copyToClipboard(media.urlOriginal)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" asChild>
                        <Link href={`/medias/${media.id}`}><ExternalLink className="h-4 w-4" /></Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setDeleteId(media.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium truncate" title={media.name || media.altText}>
                      {media.name || media.altText || "Untitled"}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{media.size ? (media.size / 1024).toFixed(1) + ' KB' : 'Unknown'}</span>
                      <span className="uppercase bg-muted px-1 rounded">{media.urlOriginal.split('.').pop()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card p-12 flex flex-col items-center justify-center gap-4 border-dashed">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">No medias found</h3>
                <p className="text-muted-foreground">Upload new media or drag and drop files here</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4">
        <AppSelectPageSize />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {mediaPage.number + 1} of {mediaPage.totalPages} ({mediaPage.totalElements} total)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination totalElements={mediaPage.totalElements} itemsPerPage={mediaPage.size} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteId === -1 ? `Delete ${selectedIds.size} selected items?` : "Delete media?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file(s) from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? <Spinner /> : "Delete Forever"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxMedia} onOpenChange={(open) => !open && setLightboxMedia(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={() => setLightboxMedia(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {lightboxMedia && (
              <img
                src={lightboxMedia.urlOriginal}
                alt={lightboxMedia.altText || lightboxMedia.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md">
            {lightboxMedia?.name}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}