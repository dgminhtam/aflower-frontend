"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@workspace/ui/components/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList
} from "@workspace/ui/components/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

export interface ComboboxOption {
    value: string
    label: string
}

interface StatusComboboxProps {
    options: readonly ComboboxOption[]
    defaultValue?: string | undefined
    onChange: (valueChange: string) => void
    disabled?: boolean
    placeholder?: string
    label?: string
}

export function Combobox({
    options,
    defaultValue,
    onChange,
    disabled,
    label,
}: StatusComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(defaultValue ?? "")

    React.useEffect(() => {
        if (defaultValue !== undefined) setValue(defaultValue)
    }, [defaultValue])

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === value ? "" : currentValue
        setValue(newValue)
        onChange(newValue)
        setOpen(false)
    }

    const selectedLabel = options.find((o) => o.value === value)?.label

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="min-w-sm justify-between"
                >
                    {selectedLabel || label}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="min-w-sm p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={handleSelect}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}