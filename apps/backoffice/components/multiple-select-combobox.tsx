'use client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@workspace/ui/components/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover'
import { cn } from '@workspace/ui/lib/utils'
import { Check, ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface MultiSelectOption {
    value: string
    label: string
}

export interface MultiSelectComboboxProps {
    options: MultiSelectOption[]
    value?: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
}

export function MultiSelectCombobox({
    options,
    value,
    onChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search items...',
    disabled = false,
}: MultiSelectComboboxProps) {
    const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set(value))
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setSelectedSet(new Set(value))
    }, [value])

    const handleSelect = (optionValue: string) => {
        const newSet = new Set(selectedSet)
        if (newSet.has(optionValue)) {
            newSet.delete(optionValue)
        } else {
            newSet.add(optionValue)
        }
        const newArray = Array.from(newSet)
        setSelectedSet(newSet)
        onChange(newArray)
    }

    const handleClear = () => {
        setSelectedSet(new Set())
        onChange([])
    }

    const handleRemoveItem = (label: string) => {
        const optionToRemove = options.find((opt) => opt.label === label)
        if (optionToRemove) {
            const newSet = new Set(selectedSet)
            newSet.delete(optionToRemove.value)
            const newArray = Array.from(newSet)
            setSelectedSet(newSet)
            onChange(newArray)
        }
    }

    const selectedLabels = options
        .filter((opt) => selectedSet.has(opt.value))
        .map((opt) => opt.label)

    const getTriggerDisplay = () => {
        const count = selectedLabels.length

        if (count === 0) {
            return <span className="text-muted-foreground">{placeholder}</span>
        }

        if (count <= 3) {
            return (
                <div className="flex flex-wrap gap-1">
                    {selectedLabels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs pr-1 flex items-center gap-1">
                            {label}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveItem(label)
                                }}
                                className="hover:opacity-70 transition-opacity"
                                aria-label={`Remove ${label}`}
                            >
                                <X className="h-3 w-3" />
                            </span>
                        </Badge>
                    ))}
                </div>
            )
        }

        // More than 3 items: show first 2 badges + count badge
        return (
            <div className="flex flex-wrap gap-1">
                {selectedLabels.slice(0, 2).map((label) => (
                    <Badge key={label} variant="secondary" className="text-xs pr-1 flex items-center gap-1">
                        {label}
                        <span
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveItem(label)
                            }}
                            className="hover:opacity-70 transition-opacity"
                            aria-label={`Remove ${label}`}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                    +{count - 2}
                </Badge>
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-sm justify-between"
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1 overflow-hidden">
                        {getTriggerDisplay()}
                    </div>
                    <ChevronDown />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedSet.has(option.value)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        {selectedSet.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={handleClear}>
                                        <span className="text-muted-foreground">Clear selection</span>
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}