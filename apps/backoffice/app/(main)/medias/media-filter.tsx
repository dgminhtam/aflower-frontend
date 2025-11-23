"use client"

import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function MediaFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('name[containsIgnoreCase]')?.toString() || "")
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            const currentSearch = params.get('name[containsIgnoreCase]') || ""

            // Only update if search term actually changed
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

    return (
        <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search media..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
        </div>
    )
}
