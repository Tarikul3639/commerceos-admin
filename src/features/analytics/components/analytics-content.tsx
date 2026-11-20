"use client"

import { useState } from "react"

import { Permission } from "@/config/permissions.config"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { ErrorState } from "@/components/shared/error-state"
import { PageLoader } from "@/components/shared/page-loader"
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

  const {
    data: revenue,
    isLoading: isRevenueLoading,
    isError: isRevenueError,
    refetch: refetchRevenue,
  } = useGetRevenueChartQuery(query, { skip: !canRead })

  const {
    data: purchaseSummary,
    isLoading: isPurchaseLoading,
    isError: isPurchaseError,
    refetch: refetchPurchaseSummary,
  } = useGetPurchaseSummaryQuery(query, { skip: !canRead })

  const {
    data: salesPurchase,
    isLoading: isSalesPurchaseLoading,
    isFetching: isSalesPurchaseFetching,
    isError: isSalesPurchaseError,
    refetch: refetchSalesPurchase,
  } = useGetSalesPurchaseChartQuery(query, { skip: !canRead })

  const {
    data: topProducts,
    isLoading: isTopProductsLoading,
    isFetching: isTopProductsFetching,
    isError: isTopProductsError,
    refetch: refetchTopProducts,
  } = useGetTopProductsQuery(query, { skip: !canRead })
  const {
    data: topCustomers,
    isLoading: isTopCustomersLoading,
    isFetching: isTopCustomersFetching,
    isError: isTopCustomersError,
    refetch: refetchTopCustomers,
  } = useGetTopCustomersQuery(query, { skip: !canRead })

  if (!canRead) return <PermissionDenied />

  const hasError =
    isRevenueError ||
    isPurchaseError ||
    isSalesPurchaseError ||
    isTopProductsError ||
    isTopCustomersError

  if (hasError) {
    return (
      <ErrorState
        onRetry={() => {
          void Promise.all([
            refetchRevenue(),
            refetchPurchaseSummary(),
            refetchSalesPurchase(),
            refetchTopProducts(),
            refetchTopCustomers(),
          ])
        }}
      />
    )
  }

  if (
    isRevenueLoading &&
    isPurchaseLoading &&
    isSalesPurchaseLoading &&
    isTopProductsLoading &&
    isTopCustomersLoading
  ) {
    return <PageLoader />
  }

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
        <AnalyticsTopProducts
          products={topProducts}
          isLoading={isTopProductsLoading}
          isFetching={isTopProductsFetching}
        />
        <AnalyticsTopCustomers
          customers={topCustomers}
          isLoading={isTopCustomersLoading}
          isFetching={isTopCustomersFetching}
        />
      </div>
    </div>
  )
}
