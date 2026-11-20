"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { useGetWishlistsQuery } from "../api/wishlists.api"
import { wishlistColumns } from "./wishlists-columns"

/** Displays customer wishlists as a permission-gated, read-only Admin report. */
export function WishlistsContent() {
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()
  const { data, isLoading, isFetching, isError, error } = useGetWishlistsQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
    },
    { skip: !permission.has(Permission.WISHLIST_READ) }
  )

  return (
    <PageContainer
      access={permission.has(Permission.WISHLIST_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Wishlists"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Wishlists" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review products customers have saved. This report is read-only and
          does not change customer wishlists.
        </p>
      }
    >
      <DataTable
        title="Customer wishlists"
        description={`${data?.meta.total ?? 0} wishlists · Most recently updated first`}
        columns={wishlistColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPagination((current) => ({ ...current, pageIndex: 0 }))
          },
          placeholder: "Search customer or product...",
        }}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No customer wishlists found."
      />
    </PageContainer>
  )
}
