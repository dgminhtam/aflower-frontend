'use client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput, // Đã thêm
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
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface MultiSelectOption {
  value: string
  label: string
  children?: MultiSelectOption[]
}

interface MultiSelectComboboxBaseProps {
  options: MultiSelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string // Thêm className để custom width từ ngoài
}

interface MultiSelectComboboxSingleProps extends MultiSelectComboboxBaseProps {
  mode: 'single'
  value: string | null
  onChange: (value: string | null) => void
}

interface MultiSelectComboboxMultipleProps extends MultiSelectComboboxBaseProps {
  mode: 'multiple'
  value: string[] | null
  onChange: (value: string[]) => void
}

export type MultiSelectComboboxProps =
  | MultiSelectComboboxSingleProps
  | MultiSelectComboboxMultipleProps

// Hàm helper để lọc cây (Quan trọng)
// Giữ lại node nếu bản thân nó khớp OR con cái nó khớp
const filterTree = (nodes: MultiSelectOption[], term: string): MultiSelectOption[] => {
  if (!term) return nodes
  
  return nodes
    .map((node) => {
      const matchesSelf = node.label.toLowerCase().includes(term.toLowerCase())
      const filteredChildren = node.children ? filterTree(node.children, term) : []
      
      // Nếu bản thân khớp, giữ lại toàn bộ con (hoặc tùy logic bạn muốn)
      // Ở đây tôi giữ logic: Nếu khớp cha thì hiện cha + con đã lọc. 
      // Nếu cha không khớp nhưng có con khớp -> Vẫn hiện cha (để chứa con)
      if (matchesSelf || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren }
      }
      return null
    })
    .filter((node) => node !== null) as MultiSelectOption[]
}

export const MultiSelectCombobox = (props: MultiSelectComboboxProps) => {
  const { options, error, placeholder = 'Select items...', disabled = false, className } = props

  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('') // State cho search

  // Sync props to state
  useEffect(() => {
    if (props.mode === 'multiple') {
      setSelectedSet(new Set(props.value || []))
    } else if (props.mode === 'single') {
      setSelectedSet(new Set(props.value ? [props.value] : []))
    }
  }, [props.value, props.mode])

  // Expand cha tự động khi search
  useEffect(() => {
    if (searchTerm) {
      const getAllIds = (nodes: MultiSelectOption[]): string[] => {
         return nodes.reduce((acc, node) => {
             const childIds = node.children ? getAllIds(node.children) : []
             return [...acc, node.value, ...childIds]
         }, [] as string[])
      }
      // Khi đang search thì mở hết tree để user thấy kết quả
      setExpandedNodes(new Set(getAllIds(options)))
    } else {
        setExpandedNodes(new Set())
    }
  }, [searchTerm, options])

  // Lọc options dựa trên search term
  const filteredOptions = useMemo(() => filterTree(options, searchTerm), [options, searchTerm])

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (props.mode === 'single') {
        // Nếu chọn lại cái đã chọn thì bỏ chọn (toggle) hoặc giữ nguyên tùy requirement
        // Ở đây tôi làm logic: Chọn cái mới -> thay thế. Chọn cái cũ -> giữ nguyên.
        const newValue = selectedSet.has(optionValue) ? null : optionValue
        // const newValue = optionValue // Hoặc dùng dòng này nếu bắt buộc phải chọn
        
        if(newValue) {
             setSelectedSet(new Set([newValue]))
             props.onChange(newValue)
             setOpen(false)
        } else {
            // Logic bỏ chọn cho single mode (optional)
             setSelectedSet(new Set())
             props.onChange(null)
        }
        
      } else if (props.mode === 'multiple') {
        const newSet = new Set(selectedSet)
        if (newSet.has(optionValue)) {
          newSet.delete(optionValue)
        } else {
          newSet.add(optionValue)
        }
        const newArray = Array.from(newSet)
        setSelectedSet(newSet)
        props.onChange(newArray)
      }
    },
    [props.mode, props.onChange, selectedSet]
  )

  const handleClear = useCallback(() => {
    setSelectedSet(new Set())
    if (props.mode === 'single') {
      props.onChange(null)
    } else if (props.mode === 'multiple') {
      props.onChange([])
    }
  }, [props.mode, props.onChange])

  const handleRemoveValue = useCallback(
    (valueToRemove: string) => {
      const newSet = new Set(selectedSet)
      newSet.delete(valueToRemove)
      setSelectedSet(newSet)

      if (props.mode === 'single') {
        props.onChange(null)
      } else if (props.mode === 'multiple') {
        const newArray = Array.from(newSet)
        props.onChange(newArray)
      }
    },
    [selectedSet, props.mode, props.onChange]
  )

  // Flatten options to find labels efficiently is better, but recursion works for small sets
  const selectedOptionsDisplay = useMemo(() => {
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

  const renderTreeItems = (opts: MultiSelectOption[], depth = 0) => {
    if (opts.length === 0) return null

    return opts.map((option) => {
        const isExpanded = expandedNodes.has(option.value)
        const hasChildren = option.children && option.children.length > 0
        
        return (
            <div key={option.value}>
                <div className="flex items-center group">
                {/* Nút Expand tách riêng */}
                {hasChildren ? (
                    <div 
                    className="p-2 cursor-pointer hover:text-primary"
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault() // Ngăn focus nhảy lung tung
                        setExpandedNodes((prev) => {
                            const newSet = new Set(prev)
                            if (newSet.has(option.value)) newSet.delete(option.value)
                            else newSet.add(option.value)
                            return newSet
                        })
                    }}
                    >
                    {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                    </div>
                ) : (
                    <div className="w-7 shrink-0" /> 
                )}

                {/* CommandItem chỉ dùng để Select */}
                <CommandItem
                    value={option.label} // Hack: Dùng label làm value để cmdk search mặc định hoạt động nếu muốn, nhưng ở đây ta đã manual filter
                    onSelect={() => handleSelect(option.value)}
                    className="flex-1 flex items-center justify-between cursor-pointer aria-selected:bg-accent"
                >
                    <span className={cn("truncate", depth > 0 && !hasChildren && "text-muted-foreground")}>
                        {option.label}
                    </span>
                    <Check
                    className={cn(
                        'h-4 w-4 shrink-0 ml-2',
                        selectedSet.has(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                    />
                </CommandItem>
                </div>
                
                {/* Render con đệ quy */}
                {hasChildren && isExpanded && (
                <div className="ml-4 border-l border-border/50 pl-1">
                    {renderTreeItems(option.children!, depth + 1)}
                </div>
                )}
            </div>
        )
    })
  }

  // Trigger UI Logic
  const renderTriggerContent = () => {
    if (selectedSet.size === 0) {
        return <span className="text-muted-foreground truncate">{placeholder}</span>
    }

    if (props.mode === 'single') {
        const selectedItem = selectedOptionsDisplay[0]
        return <span className="truncate">{selectedItem?.label || props.value}</span>
    }

    // Multiple mode UI
    return (
        <div className="flex flex-wrap gap-1">
            {selectedOptionsDisplay.slice(0, 2).map((item) => (
                <Badge key={item.value} variant="secondary" className="rounded-sm px-1 font-normal">
                    {item.label}
                    <span
                        role="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onClick={() => handleRemoveValue(item.value)}
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                </Badge>
            ))}
            {selectedSet.size > 2 && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    +{selectedSet.size - 2} more
                </Badge>
            )}
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
          className={cn(
            'w-full justify-between h-auto min-h-10 py-2 px-3',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1 text-left">
             {renderTriggerContent()}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}> {/* Tắt filter mặc định của cmdk */}
          <CommandInput 
            placeholder="Search items..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandGroup>
                {renderTreeItems(filteredOptions)}
            </CommandGroup>
            
            <CommandSeparator />
            
            {selectedSet.size > 0 && (
              <CommandGroup>
                <CommandItem onSelect={handleClear} className="justify-center text-center cursor-pointer">
                  Clear selection
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}