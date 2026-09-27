"use client"

import type { DateRange } from "react-day-picker"

import { DatePickerWithRange } from "@/components/date-picker/date-picker-with-range"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import type { AnalyticsQuery } from "../analytics.types"
import { ANALYTICS_PERIOD_OPTIONS } from "../analytics.constants"

interface AnalyticsHeaderProps {
  query: AnalyticsQuery
  onQueryChange: (query: AnalyticsQuery) => void
  className?: string
}

export function AnalyticsHeader({
  query,
  onQueryChange,
  className,
}: AnalyticsHeaderProps) {
  const dateRange: DateRange | undefined =
    query.startDate || query.endDate
      ? {
          from: query.startDate ? new Date(query.startDate) : undefined,
          to: query.endDate ? new Date(query.endDate) : undefined,
        }
      : undefined

  const handlePeriodChange = (period: AnalyticsQuery["period"]) => {
    onQueryChange({
      period,
      startDate: undefined,
      endDate: undefined,
    })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onQueryChange({
      period: undefined,
      startDate: range?.from?.toISOString(),
      endDate: range?.to?.toISOString(),
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Analytics</h1>

        <p className="text-sm text-muted-foreground">
          Track your business performance over time.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <Select
          value={query.period}
          onValueChange={(value) =>
            handlePeriodChange(value as AnalyticsQuery["period"])
          }
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectGroup>
            <SelectContent className="rounded-sm p-1">
              <SelectLabel>Period</SelectLabel>
              <SelectSeparator />

              {ANALYTICS_PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </Select>

        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>
    </div>
  )
}
