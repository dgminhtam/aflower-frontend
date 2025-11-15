"use client"

import { MediaResponse } from "@/app/lib/media/definitions"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from "@workspace/ui/components/item"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import {
  ChevronRightIcon,
  Grid,
  List,
  Trash
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AppPagination } from "../../../components/app-pagination"

interface MediaListProps {
  mediaPage: MediaResponse
}

export function MediaList({ mediaPage }: MediaListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const medias = mediaPage.content;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup type="single" variant={"outline"}>
          <ToggleGroupItem value="bold" aria-label="Toggle list" onClick={() => setViewMode("list")}>
            <List /> List
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle grid" onClick={() => setViewMode("grid")}>
            <Grid /> Grid
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {viewMode === "list" ? (
        <div className="border rounded rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>Xóa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medias.length > 0 ? (
                medias.map((media) => (
                  <TableRow key={media.id}>
                    <TableCell>
                      <Link href={`/medias/${media.id}`}>
                        {media.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Image
                        src={media?.urlThumbnail || "/placeholder.webp"}
                        alt={media.altText}
                        width={50}
                        height={50}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      {media?.urlOriginal}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        title="Delete"
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    No medias found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-4">
          {medias.length > 0 ? (
            <ItemGroup className="grid grid-cols-6 gap-2">
              {medias.map((media) => (
                <Item key={media.id} variant="outline" className="rounded-xl p-2">
                  <ItemHeader>
                    <Image
                      src={media.urlMedium}
                      alt={media.altText}
                      width={128}
                      height={128}
                      className="w-full rounded-md"
                    />
                  </ItemHeader>
                  <ItemContent>
                    <ItemTitle>{media.altText}</ItemTitle>
                    <ItemDescription>{media.size} KB</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon />
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Card className="border-border bg-card p-12">
              <p className="text-center text-muted-foreground">No products found. Try adjusting your filters.</p>
            </Card>
          )}


        </div>
      )}
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
    </div>
  )
}