"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@workspace/ui/lib/utils"

function Slider({
    className,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    return (
        <SliderPrimitive.Root
            data-slot="slider"
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full"
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className="bg-primary absolute h-full"
                />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                className="border-primary bg-background ring-ring/50 block size-4 rounded-full border shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
            />
            {/* Support for range slider (2 thumbs) */}
            {(props.defaultValue?.length === 2 || props.value?.length === 2) && (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    className="border-primary bg-background ring-ring/50 block size-4 rounded-full border shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
                />
            )}
        </SliderPrimitive.Root>
    )
}

export { Slider }
