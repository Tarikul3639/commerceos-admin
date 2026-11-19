"use client"

import { useState } from "react"

import { Permission } from "@/config/permissions.config"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { usePermission } from "@/hooks/use-permission"

import {
  useGetRevenueChartQuery,
  useGetSalesPurchaseChartQuery,
  useGetPurchaseSummaryQuery,
  useGetTopCustomersQuery,
  useGetTopProductsQuery,
} from "../analytics.api"
import type { AnalyticsQuery } from "../analytics.types"

import { AnalyticsHeader } from "./analytics-header"
import { AnalyticsRevenue } from "./analytics-revenue"
import { AnalyticsSalesVsPurchaseChart } from "./analytics-sales-purchase-chart"
import { AnalyticsTopCustomers } from "./analytics-top-customers"
import { AnalyticsTopProducts } from "./analytics-top-products"
import { AnalyticsPurchaseSummary } from "./analytics-purchase-summary"

export function AnalyticsContent() {
  const canRead = usePermission().has(Permission.ANALYTICS_READ)
  const [query, setQuery] = useState<AnalyticsQuery>({
    period: "30d",
  })

  const { data: revenue, isLoading: isRevenueLoading } =
    useGetRevenueChartQuery(query, { skip: !canRead })

  const { data: purchaseSummary, isLoading: isPurchaseLoading } =
    useGetPurchaseSummaryQuery(query, { skip: !canRead })

  const {
    data: salesPurchase,
    isLoading: isSalesPurchaseLoading,
    isFetching: isSalesPurchaseFetching,
  } = useGetSalesPurchaseChartQuery(query, { skip: !canRead })

  const { data: topProducts } = useGetTopProductsQuery(query, {
    skip: !canRead,
  })
  const { data: topCustomers } = useGetTopCustomersQuery(query, {
    skip: !canRead,
  })

  if (!canRead) return <PermissionDenied />

  return (
    <div className="space-y-6">
      <AnalyticsHeader query={query} onQueryChange={setQuery} />

      <div className="grid min-w-0 gap-3">
        <AnalyticsSalesVsPurchaseChart
          data={salesPurchase}
          isLoading={isSalesPurchaseLoading}
          isFetching={isSalesPurchaseFetching}
        />

        <AnalyticsRevenue revenue={revenue} isLoading={isRevenueLoading} />
      </div>

      <AnalyticsPurchaseSummary
        purchases={purchaseSummary}
        isLoading={isPurchaseLoading}
      />

      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <AnalyticsTopProducts products={topProducts} />
        <AnalyticsTopCustomers customers={topCustomers} />
      </div>
    </div>
  )
}
