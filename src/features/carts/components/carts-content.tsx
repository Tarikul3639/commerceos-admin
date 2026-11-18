"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"

import { useGetCartsQuery } from "../api/carts.api"
import { cartColumns } from "./carts-columns"

export function CartsContent() {
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()

  const { data, isLoading, isFetching, isError, error } = useGetCartsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  return (
    <PageContainer
      access={permission.has(Permission.CART_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Carts"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Carts" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review active customer carts. Cart values are estimates based on
          current product prices; this screen is read-only and does not reserve
          inventory or change customer carts.
        </p>
      }
    >
      <DataTable
        title="Active customer carts"
        description={`${data?.meta.total ?? 0} active carts · Newest activity first`}
        columns={cartColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        search={{
          value: search,
          onChange: handleSearch,
          placeholder: "Search customer or product...",
        }}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No active carts found."
      />
    </PageContainer>
  )
}
