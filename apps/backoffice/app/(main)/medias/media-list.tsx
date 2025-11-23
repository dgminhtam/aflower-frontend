"use client"

import { MediaResponse } from "@/app/lib/media/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
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
import {
  ExternalLink,
  Grid,
  List,
  MoreHorizontal,
  Trash
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface MediaListProps {
  mediaPage: MediaResponse
  onDelete?: (id: number) => void
}

export function MediaList({ mediaPage, onDelete }: MediaListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const medias = mediaPage.content;

  const handleDelete = () => {
    if (deleteId) {
      onDelete?.(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Total <strong>{mediaPage.totalElements}</strong> items
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
                  <TableHead className="w-[80px] pl-6 font-semibold text-foreground">ID</TableHead>
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
                    <TableRow key={media.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-6">
                        {media.id}
                      </TableCell>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded overflow-hidden border bg-muted">
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
                        <div className="max-w-[300px] truncate text-sm text-muted-foreground" title={media.urlOriginal}>
                          {media.urlOriginal}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/medias/${media.id}`} className="flex items-center">
                                <ExternalLink className="mr-2 h-4 w-4" /> View Details
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
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No medias found.
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
                <Card key={media.id} className="group relative overflow-hidden rounded-lg border hover:shadow-md transition-all">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={media.urlMedium || media.urlThumbnail || "/placeholder.webp"}
                      alt={media.altText || "Media"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    {/* Overlay Actions on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                      <span className="uppercase">{media.urlOriginal.split('.').pop()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card p-12">
              <p className="text-center text-muted-foreground">No medias found. Try adjusting your filters.</p>
            </Card>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4">
        <AppSelectPageSize />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Trang {mediaPage.number + 1} trên {mediaPage.totalPages} ({mediaPage.totalElements} tổng)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination totalElements={mediaPage.totalElements} itemsPerPage={mediaPage.size} />
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the media file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}