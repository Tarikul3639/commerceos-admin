"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { useGetStocksQuery } from "../api/stock.api"
import { columns } from "./stock-columns"

export function StockContent() {
  const [search, setSearch] = useState("")
  const [lowStock, setLowStock] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()
  const { data, isLoading, isFetching, isError, error } = useGetStocksQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    lowStock: lowStock || undefined,
  })

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.STOCK_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Stock"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Stock" },
      ]}
    >
      <DataTable
        title="Stock levels"
        description="Review current product quantities and record stock adjustments."
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            resetPage()
          },
          placeholder: "Search products or SKU...",
        }}
        toolbarFilters={
          <Select
            value={lowStock ? "low" : "all"}
            onValueChange={(value) => {
              setLowStock(value === "low")
              resetPage()
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Stock level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stock</SelectItem>
              <SelectItem value="low">Low stock (≤ 5)</SelectItem>
            </SelectContent>
          </Select>
        }
        columnVisibility
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No stock records found."
      />
    </PageContainer>
  )
}
