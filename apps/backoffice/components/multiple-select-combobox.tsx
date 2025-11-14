'use client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
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
import {
    Check,
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    X,
} from 'lucide-react'
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

export interface MultiSelectOption {
    value: string
    label: string
    children?: MultiSelectOption[]
}

export interface MultiSelectComboboxProps {
    options: MultiSelectOption[]
    value: string | string[]
    onChange: (value: string | string[]) => void
    placeholder?: string
    disabled?: boolean
    mode?: 'single' | 'multiple'
}

export const MultiSelectCombobox = ({
    options,
    value,
    onChange,
    placeholder = 'Select items...',
    disabled = false,
    mode = 'multiple',
}: MultiSelectComboboxProps) => {
    const [selectedSet, setSelectedSet] = useState<Set<string>>(
        new Set(Array.isArray(value) ? value : value ? [value] : [])
    )
    const [open, setOpen] = useState(false)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

    useEffect(() => {
        setSelectedSet(
            new Set(Array.isArray(value) ? value : value ? [value] : [])
        )
    }, [value])

    const handleSelect = useCallback(
        (optionValue: string) => {
            if (mode === 'single') {
                setSelectedSet(new Set([optionValue]))
                onChange(optionValue)
                setOpen(false)
            } else {
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
        },
        [mode, onChange, selectedSet]
    )

    const handleClear = useCallback(() => {
        setSelectedSet(new Set())
        const clearedValue = mode === 'single' ? '' : []
        onChange(clearedValue)
    }, [mode, onChange])

    const handleRemoveValue = useCallback(
        (valueToRemove: string) => {
            const newSet = new Set(selectedSet)
            newSet.delete(valueToRemove)
            const newArray = Array.from(newSet)
            setSelectedSet(newSet)
            onChange(mode === 'single' ? '' : newArray)
        },
        [selectedSet, mode, onChange]
    )

    const selectedOptions = useMemo(() => {
        const selected: { value: string; label: string }[] = []
        const findSelected = (opts: MultiSelectOption[]) => {
            for (const opt of opts) {
                if (selectedSet.has(opt.value)) {
                    selected.push({ value: opt.value, label: opt.label })
                }
                if (opt.children) {
                    findSelected(opt.children)
                }
            }
        }
        findSelected(options)
        return selected
    }, [options, selectedSet])

    const triggerDisplay = useMemo(() => {
        const count = selectedOptions.length

        if (count === 0) {
            return <span className="text-muted-foreground">{placeholder}</span>
        }

        if (mode === 'single') {
            const { value, label } = selectedOptions[0]!
            return (
                <div className="flex items-center gap-1">
                    <span>{label}</span>
                    {label && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveValue(value)
                            }}
                            className="hover:opacity-70 transition-opacity"
                            aria-label={`Remove ${label}`}
                        >
                            <X className="h-4 w-4" />
                        </span>
                    )}
                </div>
            )
        }

        if (count <= 3) {
            return (
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map(({ value, label }) => (
                        <Badge
                            key={value}
                            variant="secondary"
                            className="text-xs pr-1 flex items-center gap-1"
                        >
                            {label}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveValue(value)
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

        return (
            <div className="flex flex-wrap gap-1">
                {selectedOptions.slice(0, 2).map(({ value, label }) => (
                    <Badge
                        key={value}
                        variant="secondary"
                        className="text-xs pr-1 flex items-center gap-1"
                    >
                        {label}
                        <span
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveValue(value)
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
    }, [selectedOptions, placeholder, mode, handleRemoveValue])

    const renderTreeItems = (opts: MultiSelectOption[], depth = 0) => {
        return opts.map((option) => (
            <div key={option.value}>
                <div className="flex items-center">
                    {option.children && option.children.length > 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setExpandedNodes((prev) => {
                                    const newSet = new Set(prev)
                                    if (newSet.has(option.value)) {
                                        newSet.delete(option.value)
                                    } else {
                                        newSet.add(option.value)
                                    }
                                    return newSet
                                })
                            }}
                            className="mr-1 p-0.5 hover:bg-accent rounded"
                        >
                            {expandedNodes.has(option.value) ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    ) : (
                        <div className="w-6 shrink-0" />
                    )}
                    <CommandItem
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className="flex-1 flex items-center justify-between"
                    >
                        <span>{option.label}</span>
                        <Check
                            className={cn(
                                'h-4 w-4 shrink-0',
                                selectedSet.has(option.value) ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                    </CommandItem>
                </div>
                {option.children && expandedNodes.has(option.value) && (
                    <div className="ml-2 border-l border-border">
                        {renderTreeItems(option.children, depth + 1)}
                    </div>
                )}
            </div>
        ))
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
                        {triggerDisplay}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="min-w-sm p-0" align="start">
                <Command>
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>{renderTreeItems(options)}</CommandGroup>

                        {selectedSet.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={handleClear}>
                                        <span className="text-muted-foreground">
                                            Clear selection
                                        </span>
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