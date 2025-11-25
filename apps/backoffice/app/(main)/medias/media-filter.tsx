"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { Filter, Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function MediaFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Search Term
    const [searchTerm, setSearchTerm] = useState(searchParams.get('name[containsIgnoreCase]')?.toString() || "")

    // Advanced Filters
    const [minSize, setMinSize] = useState(searchParams.get('size[ge]')?.toString() || "")
    const [maxSize, setMaxSize] = useState(searchParams.get('size[le]')?.toString() || "")
    const [sortBy, setSortBy] = useState(searchParams.get('sort')?.toString() || "")

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Debounce Search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            const currentSearch = params.get('name[containsIgnoreCase]') || ""

            if (currentSearch !== searchTerm) {
                params.set('page', '1')
                if (searchTerm) {
                    params.set('name[containsIgnoreCase]', searchTerm)
                } else {
                    params.delete('name[containsIgnoreCase]')
                }
                replace(`${pathname}?${params.toString()}`)
            }
        }, 300)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [searchTerm, pathname, replace, searchParams])

    // Apply Advanced Filters
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')

        if (minSize) params.set('size[ge]', minSize)
        else params.delete('size[ge]')

        if (maxSize) params.set('size[le]', maxSize)
        else params.delete('size[le]')

        if (sortBy) params.set('sort', sortBy)
        else params.delete('sort')

        replace(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        setMinSize("")
        setMaxSize("")
        setSortBy("")

        const params = new URLSearchParams(searchParams)
        params.delete('size[ge]')
        params.delete('size[le]')
        params.delete('sort')
        replace(`${pathname}?${params.toString()}`)
    }

    const hasActiveFilters = minSize || maxSize || sortBy

    return (
        <div className="flex items-center gap-2 flex-1 md:grow-0">
            <div className="relative flex-1 md:w-[200px] lg:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search media..."
                    className="w-full rounded-lg bg-background pl-8"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={hasActiveFilters ? "secondary" : "outline"} size="icon" className="shrink-0">
                        <Filter className={`h-4 w-4 ${hasActiveFilters ? "text-primary" : ""}`} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filter & Sort</h4>
                            <p className="text-sm text-muted-foreground">
                                Refine your media list.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="minSize">Min Size (KB)</Label>
                                    <Input
                                        id="minSize"
                                        type="number"
                                        placeholder="0"
                                        value={minSize}
                                        onChange={(e) => setMinSize(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="maxSize">Max Size (KB)</Label>
                                    <Input
                                        id="maxSize"
                                        type="number"
                                        placeholder="Max"
                                        value={maxSize}
                                        onChange={(e) => setMaxSize(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="sortBy">Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger id="sortBy">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="id_desc">Newest First</SelectItem>
                                        <SelectItem value="id_asc">Oldest First</SelectItem>
                                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                        <SelectItem value="size_desc">Size (Largest)</SelectItem>
                                        <SelectItem value="size_asc">Size (Smallest)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
                                <X className="mr-2 h-4 w-4" /> Clear
                            </Button>
                            <Button size="sm" onClick={applyFilters}>Apply</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
