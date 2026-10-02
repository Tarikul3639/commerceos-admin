"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface RatingProps {
    value: number
    count?: number
    showValue?: boolean
    showCount?: boolean
    size?: "xs" | "sm" | "md" | "lg"
    className?: string
}

export function Rating({
    value,
    count,
    showValue = true,
    showCount = true,
    size = "sm",
    className,
}: RatingProps) {
    let starSize: string

    switch (size) {
        case "xs":
            starSize = "h-2.5 w-2.5"
            break
        case "sm":
            starSize = "h-3 w-3"
            break
        case "md":
            starSize = "h-4.5 w-4.5"
            break
        case "lg":
            starSize = "h-5 w-5"
            break
        default:
            starSize = "h-4 w-4"
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        className={cn(
                            starSize,
                            index < Math.round(value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                        )}
                    />
                ))}
            </div>

            {showValue && (
                <span className="text-sm font-medium">{value.toFixed(1)}</span>
            )}

            {showCount && count !== undefined && (
                <span className="text-sm text-muted-foreground">({count})</span>
            )}
        </div>
    )
}
