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

interface SelectDemoProps {
    placeholder: string;
    options: { value: string; label: string, classStyle: string }[];
    currentOption: string;
    onStatusChange: (status: string) => void;
}

export function AppSelect({ placeholder, options, currentOption, onStatusChange }: SelectDemoProps) {

    return (
        <Select onValueChange={onStatusChange} defaultValue={currentOption}>
            <SelectTrigger className={`${options.find(option => option.value === currentOption)?.classStyle || ''}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{placeholder}</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}