"use client"

import { useState } from "react"

import { PageContainer } from "@/components/layout/page-container"
import { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { columns } from "./discount-columns"
import { useGetDiscountsQuery } from "../api/discount.api"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { CreateDiscountDialog } from "./create-discount-dialog"

export function DiscountContent() {
  const permission = usePermission()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [search, setSearch] = useState<string>("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isLoading, isFetching, isError, error } = useGetDiscountsQuery({
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const discounts = data?.data || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  return (
    <PageContainer
      access={permission.has(Permission.DISCOUNT_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Discounts"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discounts" },
      ]}
      pageHeaderAction={
        permission.has(Permission.DISCOUNT_CREATE) && (
          <CreateDiscountDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        )
      }
    >
      <DataTable
        title="Discounts"
        description="Manage percentage discounts for individual products."
        columns={columns}
        data={discounts || []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}

        // Search
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search discounts...",
        }}

        // Pagination
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={meta.total}

        // Column visibility
        columnVisibility={true}
        initialColumnVisibility={{
          createdAt: false,
          updatedAt: false,
        }}
      />
    </PageContainer>
  )
}
