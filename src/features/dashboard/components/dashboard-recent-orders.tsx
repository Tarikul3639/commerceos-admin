"use client"

import { useState } from "react"

import { Inbox } from "lucide-react"

import { DataTable } from "@/components/data-table"

import type { RecentOrder } from "../dashboard.types"
import { columns } from "./dashboard-recent-orders-columns"

interface DashboardRecentOrdersProps {
  orders?: RecentOrder[]
  isLoading?: boolean
  isFetching?: boolean
}

export function DashboardRecentOrders({
  orders = [],
  isLoading = false,
  isFetching = false,
}: DashboardRecentOrdersProps) {
  const [search, setSearch] = useState<string>("")

  return (
    <div className="h-full max-h-150 min-h-80 min-w-0">
      <DataTable
        columns={columns}
        data={orders}
        title="Recent Orders"
        description="Latest customer orders"
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search orders...",
        }}
        isLoading={isLoading}
        isFetching={isFetching}
        columnVisibility
        emptyText="No recent orders"
        emptyIcon={Inbox}
      />
    </div>
  )
}
