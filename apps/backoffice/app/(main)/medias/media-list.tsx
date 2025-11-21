"use client"

import { MediaResponse } from "@/app/lib/media/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
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
  List, // Dùng icon này nếu muốn menu drop down, hoặc Trash
  Trash
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface MediaListProps {
  mediaPage: MediaResponse
  // Nên thêm prop onDelete để xử lý logic xóa từ cha hoặc gọi API
  onDelete?: (id: number) => void
}

export function MediaList({ mediaPage, onDelete }: MediaListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const medias = mediaPage.content;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this media?")) {
      // Gọi hàm onDelete prop hoặc server action tại đây
      onDelete?.(id);
      console.log("Deleting media:", id);
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Url</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medias.length > 0 ? (
                medias.map((media) => (
                  <TableRow key={media.id}>
                    <TableCell className="font-medium">
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
                      <div className="max-w-[300px] truncate text-sm text-muted-foreground" title={media.urlOriginal}>
                        {media.urlOriginal}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/medias/${media.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(media.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No medias found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* VIEW MODE: GRID */
        <div>
          {medias.length > 0 ? (
            // FIX: Responsive grid (2 cột mobile, 4 tablet, 6 desktop)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                      <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                        <Link href={`/medias/${media.id}`}><ExternalLink className="h-4 w-4" /></Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDelete(media.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium truncate" title={media.altText}>
                      {media.altText || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {media.size ? `${(media.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="text-muted-foreground">No medias found. Try adjusting your filters.</div>
            </Card>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {mediaPage.size * mediaPage.number + 1} to {Math.min(mediaPage.size * (mediaPage.number + 1), mediaPage.totalElements)} of {mediaPage.totalElements} entries
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <AppSelectPageSize />
          <AppPagination totalElements={mediaPage.totalElements} itemsPerPage={mediaPage.size} />
        </div>
      </div>
    </div>
  )
}