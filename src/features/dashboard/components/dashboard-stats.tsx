import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react"

import { StatCard, StatCardGrid } from "@/components/stat-card"
import type { DashboardOverview } from "../dashboard.types"

interface DashboardStatsProps {
  data?: DashboardOverview
  isLoading?: boolean
  isError?: boolean
}

export function DashboardStats({
  data,
  isLoading = false,
  isError = false,
}: DashboardStatsProps) {
  return (
    <StatCardGrid isLoading={isLoading} isError={isError} skeletonCount={4}>
      {data && (
        <>
          <StatCard
            title="Total Sales"
            value={`${Number(data.sales.totalSales).toLocaleString()}`}
            isAmount
            trend={data.sales.salesGrowth}
            icon={<DollarSign className="size-4" />}
          />

          <StatCard
            title="Total Orders"
            value={data.orders.totalOrders.toLocaleString()}
            icon={<ShoppingCart className="size-4" />}
            description="All orders"
          />

          <StatCard
            title="Stock Value"
            value={`${Number(data.stock.totalStockValue).toLocaleString()}`}
            isAmount
            icon={<Warehouse className="size-4" />}
            description="Value of current stock.
"
          />

          <StatCard
            title="Total Products"
            value={data.stock.totalProducts.toLocaleString()}
            icon={<ShoppingBag className="size-4" />}
            description="All products in stock"
          />
        </>
      )}
    </StatCardGrid>
  )
}
