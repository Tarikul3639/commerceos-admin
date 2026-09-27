"use client"

import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  ShoppingCart,
  Clock3,
} from "lucide-react"

import { TakaIcon } from "@/components/icons/taka-icon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { PurchaseSummary } from "../analytics.types"

interface AnalyticsPurchaseSummaryProps {
  purchases?: PurchaseSummary
  isLoading?: boolean
}

export function AnalyticsPurchaseSummary({
  purchases,
  isLoading = false,
}: AnalyticsPurchaseSummaryProps) {
  if (isLoading) {
    return <AnalyticsPurchaseSummarySkeleton />
  }

  const growth = purchases?.purchaseGrowth ?? 0
  const isPositive = growth >= 0

  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <CardTitle className="text-sm sm:text-base">
          Purchase Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Total Purchases */}
          <PurchaseMetric
            icon={TakaIcon}
            label="Total Purchases"
            value={formatAmount(purchases?.totalPurchases)}
          />

          {/* Today's Purchases */}
          <PurchaseMetric
            icon={ShoppingCart}
            label="Today's Purchases"
            value={formatAmount(purchases?.todayPurchases)}
          />

          {/* Purchase Orders */}
          <PurchaseMetric
            icon={ClipboardList}
            label="Purchase Orders"
            value={formatNumber(purchases?.totalPurchaseOrders)}
            showCurrency={false}
          />

          {/* Purchase Growth */}
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs text-muted-foreground sm:text-sm">
              Purchase Growth
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

        {/* Pending purchases */}
        {purchases?.pendingPurchases !== undefined && (
          <div className="mt-3 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground sm:mt-4 sm:gap-2 sm:text-sm">
            <Clock3 className="size-3.5 shrink-0 sm:size-4" />

            <span className="truncate">
              {purchases.pendingPurchases.toLocaleString("en-BD")} pending
              purchase orders
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PurchaseMetricProps {
  icon: React.ElementType
  label: string
  value: string
  showCurrency?: boolean
}

function PurchaseMetric({
  icon: Icon,
  label,
  value,
  showCurrency = true,
}: PurchaseMetricProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
        <Icon className="size-3 shrink-0 sm:size-3.5" />

        <p className="truncate text-xs sm:text-sm">{label}</p>
      </div>

      <div className="flex min-w-0 items-center gap-1">
        {showCurrency && (
          <span className="shrink-0 text-muted-foreground">
            <TakaIcon className="size-4 sm:size-4.5" />
          </span>
        )}

        <p className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
          {value}
        </p>
      </div>
    </div>
  )
}

function AnalyticsPurchaseSummarySkeleton() {
  return (
    <Card className="min-w-0 overflow-hidden py-0">
      <CardHeader className="px-3 py-3 sm:px-4 sm:py-3.5">
        <Skeleton className="h-5 w-36 sm:h-6 sm:w-40" />
      </CardHeader>

      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <Skeleton className="h-4 w-24 sm:w-28" />
              <Skeleton className="h-7 w-28 sm:h-8 sm:w-32" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-3 h-4 w-44 sm:mt-4 sm:h-5 sm:w-48" />
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

function formatNumber(value?: number) {
  if (value === undefined) return "0"

  return value.toLocaleString("en-BD")
}
