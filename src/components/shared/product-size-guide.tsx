"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronDown, Ruler } from "lucide-react"

export interface SizeGuide {
    id: string
    name: string
    description: string | null
    unit: string
    columns: string[]
    rows: Record<string, string | number>[]
}

interface ProductSizeGuideTriggerProps {
    open: boolean
    className?: string
    onClick?: () => void
}

interface ProductSizeGuideContentProps {
    sizeGuide?: SizeGuide | null
    selectedSize?: string | null
}

/** Size guide toggle trigger */
export function ProductSizeGuideTrigger({
    open,
    className,
    onClick,
}: ProductSizeGuideTriggerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            className={cn(
                "flex items-center gap-1 text-xs font-medium text-primary-foreground/95 transition-colors hover:text-primary",
                className
            )}
        >
            <Ruler className="size-2.5" />

            <span>{open ? "Hide" : "Size Guide"}</span>

            <ChevronDown
                className={cn(
                    "size-3.5 transition-transform duration-300",
                    open && "rotate-180"
                )}
            />
        </button>
    )
}

/** Dynamic size guide table */
export function ProductSizeGuideContent({
    sizeGuide,
    selectedSize,
}: ProductSizeGuideContentProps) {
    const columns = sizeGuide?.columns ?? []
    const rows = sizeGuide?.rows ?? []
    const sizeColumn = columns[0]

    return (
        <div className="space-y-2">
            {!sizeGuide || columns.length === 0 || rows.length === 0 ? (
                <p className="rounded-md border p-3 text-xs text-muted-foreground">
                    Size guide is currently unavailable.
                </p>
            ) : (
                <>
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader className="border-b bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    {columns.map((column) => (
                                        <TableHead
                                            key={column}
                                            className="h-8 px-2 text-center text-[11px] font-semibold text-primary uppercase"
                                        >
                                            {column}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((item, rowIndex) => {
                                    const rowSize = item[sizeColumn]

                                    const isSelected =
                                        selectedSize != null &&
                                        rowSize != null &&
                                        String(rowSize) === selectedSize

                                    return (
                                        <TableRow
                                            key={String(rowSize ?? rowIndex)}
                                            className={cn("h-8", isSelected && "bg-primary/5")}
                                        >
                                            {columns.map((column, columnIndex) => (
                                                <TableCell
                                                    key={column}
                                                    className={cn(
                                                        "px-2 py-1.5 text-center text-xs",
                                                        columnIndex === 0 && "font-medium",
                                                        columnIndex === 0 && isSelected && "text-primary"
                                                    )}
                                                >
                                                    {item[column] ?? "—"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {(sizeGuide.unit || sizeGuide.description) && (
                        <p className="text-[10px] text-muted-foreground">
                            {sizeGuide.unit && (
                                <>
                                    Measurements in{" "}
                                    <span className="text-primary">{sizeGuide.unit}</span>.
                                </>
                            )}
                            {sizeGuide.description && ` ${sizeGuide.description}`}
                        </p>
                    )}
                </>
            )}
        </div>
    )
}
