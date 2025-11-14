"use client";

import { Check, PlusCircle } from 'lucide-react';
import * as React from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from '@workspace/ui/lib/utils';

interface SelectMultipleProps {
  values: string[];
  onChange?: (value: string[]) => void;
  title?: string;
  options: { label: string; value: string }[];
}

export function SelectMultiple({
  values = [],
  onChange,
  title,
  options,
}: SelectMultipleProps) {
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(new Set(values));
  const handleSelect = (value: string) => {
    const updatedValues = new Set(selectedValues);
    if (updatedValues.has(value)) {
      updatedValues.delete(value);
    } else {
      updatedValues.add(value);
    }
    setSelectedValues(updatedValues);
    onChange?.(Array.from(updatedValues));
  };

  const handleSelectAll = () => {
    let updatedValues: Set<string>;
    if (selectedValues.size === options.length) {
      updatedValues = new Set();
    } else {
      updatedValues = new Set(options.map((option) => option.value));
    }
    setSelectedValues(updatedValues);
    onChange?.(Array.from(updatedValues));
  };

  const allSelected = selectedValues.size === options.length;

  React.useEffect(() => {
    setSelectedValues(new Set(values));
  }, [values]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command className="rounded-lg">
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Không có kết quả.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={handleSelectAll}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    allSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className={cn(allSelected ? "opacity-100" : "opacity-0")} />
                </div>
                <span>(Chọn toàn bộ)</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn(isSelected ? "opacity-100" : "opacity-0")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set());
                      onChange?.([]);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}