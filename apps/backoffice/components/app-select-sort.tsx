"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Option } from "@/app/lib/admin/definitions";

interface SelectSortProps {
    sortOptions: Option[];
}

export function SelectSort({ sortOptions }: SelectSortProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleSelectChange = (value: string) => {
        const updatedParams = new URLSearchParams(searchParams.toString());
        updatedParams.set("sort", value);
        router.push(`${pathname}?${updatedParams.toString()}`);
    };

    return (
        <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]"  size="sm">
                <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sắp xếp</SelectLabel>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
