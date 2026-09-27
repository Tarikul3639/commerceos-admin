import type { ReactNode } from "react"

import { TakaIcon } from "@/components/icons/taka-icon"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: ReactNode
  isAmount?: boolean
  description?: ReactNode
  icon?: ReactNode
  className?: string
  valueClassName?: string
}

export function MetricCard({
  label,
  value,
  isAmount = false,
  description,
  icon,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card className={cn("py-0", className)}>
      <CardContent className="p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
            {/* Metric label */}
            <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
              {label}
            </p>

            {/* Metric value */}
            <div
              className={cn(
                "flex min-w-0 items-center gap-1 text-xl font-semibold tracking-tight sm:text-2xl",
                valueClassName
              )}
            >
              {isAmount && (
                <span className="shrink-0 text-muted-foreground">
                  <TakaIcon className="size-4 sm:size-4.5" />
                </span>
              )}

              <span className="min-w-0 truncate">{value}</span>
            </div>

            {/* Metric description */}
            {description && (
              <div className="min-w-0 text-xs text-muted-foreground">
                {description}
              </div>
            )}
          </div>

          {/* Metric icon */}
          {icon && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-9">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
