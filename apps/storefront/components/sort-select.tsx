"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

interface SortOption {
    label: string
    value: string
}

interface SortSelectProps {
    options: SortOption[]
    placeholder?: string
}

export function SortSelect({
    options,
    placeholder = "Sắp xếp theo",
}: SortSelectProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get current sort value from URL
    const currentSort = searchParams.get("sort") || ""

    const onSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set("sort", value)
        } else {
            params.delete("sort")
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Select value={currentSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
