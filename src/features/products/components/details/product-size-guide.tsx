"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown, Ruler } from "lucide-react"

interface SizeGuideItem {
    size: string
    chest: string
    length: string
    shoulder: string
    sleeve: string
}

interface ProductSizeGuideTriggerProps {
    open: boolean
    className?: string
}

interface ProductSizeGuideContentProps {
    sizes: SizeGuideItem[]
    selectedSize?: string
}

export function ProductSizeGuideTrigger({
    open,
    className,
}: ProductSizeGuideTriggerProps) {
    return (
        <CollapsibleTrigger asChild>
            <button
                type="button"
                className={cn(
                    "flex items-center gap-1 text-xs font-medium transition-colors hover:text-primary",
                    className
                )}
            >
                <Ruler className="size-2.5" />

                <span>{open ? "Hide Size Guide" : "Size Guide"}</span>

                <ChevronDown
                    className={cn(
                        "size-3.5 transition-transform duration-300",
                        open && "rotate-180"
                    )}
                />
            </button>
        </CollapsibleTrigger>
    )
}

export function ProductSizeGuideContent({
    sizes,
    selectedSize,
}: ProductSizeGuideContentProps) {
    return (
        <CollapsibleContent className="space-y-2 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-8 px-2 text-[10px]">
                                Size
                            </TableHead>

                            <TableHead className="h-8 px-2 text-right text-[10px]">
                                Chest
                            </TableHead>

                            <TableHead className="h-8 px-2 text-right text-[10px]">
                                Length
                            </TableHead>

                            <TableHead className="h-8 px-2 text-right text-[10px]">
                                Shoulder
                            </TableHead>

                            <TableHead className="h-8 px-2 text-right text-[10px]">
                                Sleeve
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sizes.map((item) => {
                            const isSelected = selectedSize === item.size

                            return (
                                <TableRow
                                    key={item.size}
                                    className={cn(
                                        "h-8",
                                        isSelected && "bg-primary/5"
                                    )}
                                >
                                    <TableCell
                                        className={cn(
                                            "px-2 py-1.5 text-xs font-medium",
                                            isSelected && "text-primary"
                                        )}
                                    >
                                        {item.size}
                                    </TableCell>

                                    <TableCell className="px-2 py-1.5 text-right text-xs">
                                        {item.chest}
                                    </TableCell>

                                    <TableCell className="px-2 py-1.5 text-right text-xs">
                                        {item.length}
                                    </TableCell>

                                    <TableCell className="px-2 py-1.5 text-right text-xs">
                                        {item.shoulder}
                                    </TableCell>

                                    <TableCell className="px-2 py-1.5 text-right text-xs">
                                        {item.sleeve}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <p className="text-[10px] text-muted-foreground">
                Measurements in inches. Size up for an oversized fit.
            </p>
        </CollapsibleContent>
    )
}