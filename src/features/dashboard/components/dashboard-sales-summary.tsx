"use client"

import { ArrowDownRight, ArrowUpRight, ShoppingCart } from "lucide-react"

import { TakaIcon } from "@/components/icons/taka-icon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { SalesSummary } from "../dashboard.types"

interface DashboardSalesSummaryProps {
  sales?: SalesSummary
  isLoading?: boolean
}

export function DashboardSalesSummary({
  sales,
  isLoading = false,
}: DashboardSalesSummaryProps) {
  if (isLoading) {
    return <DashboardSalesSummarySkeleton />
  }

  const growth = sales?.salesGrowth ?? 0
  const isPositive = growth >= 0

  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <CardTitle className="text-sm sm:text-base">Sales Overview</CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Total Sales */}
          <SalesMetric
            icon={TakaIcon}
            label="Total Sales"
            value={formatAmount(sales?.totalSales)}
          />

          {/* Today's Sales */}
          <SalesMetric
            icon={TakaIcon}
            label="Today's Sales"
            value={formatAmount(sales?.todaySales)}
          />

          {/* Average Order Value */}
          <SalesMetric
            icon={ShoppingCart}
            label="Average Order Value"
            value={formatAmount(sales?.averageOrderValue)}
          />

          {/* Sales Growth */}
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Sales Growth
            </p>

            <div
              className={cn(
                "flex items-center gap-1 text-xl font-semibold tracking-tight sm:text-2xl",
                isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-4 shrink-0 sm:size-5" />
              ) : (
                <ArrowDownRight className="size-4 shrink-0 sm:size-5" />
              )}

              <span>{Math.abs(growth).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SalesMetricProps {
  icon: React.ElementType
  label: string
  value: string
}

function SalesMetric({ icon: Icon, label, value }: SalesMetricProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
        <Icon className="size-3 shrink-0 sm:size-3.5" />

        <p className="truncate text-xs sm:text-sm">{label}</p>
      </div>

      <div className="flex min-w-0 items-center gap-1">
        <span className="shrink-0 text-muted-foreground">
          <TakaIcon className="size-4 sm:size-4.5" />
        </span>

        <p className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
          {value}
        </p>
      </div>
    </div>
  )
}

function DashboardSalesSummarySkeleton() {
  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <Skeleton className="h-5 w-32 sm:h-6 sm:w-36" />
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-28 sm:h-8 sm:w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function formatAmount(value?: string) {
  if (!value) return "0"

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return amount.toLocaleString("en-BD")
}
