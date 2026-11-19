"use client"

import { useState } from "react"

import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"

import { useGetBrandsQuery } from "../api/brands.api"
import type { Brand } from "../types/brands.types"
import { columns } from "./brands-columns"
import { CreateBrandDialog } from "./create-brand-dialog"

export function BrandsContent() {
  const { has } = usePermission()
  const canRead = has(Permission.BRAND_READ)
  const canCreate = has(Permission.BRAND_CREATE)
  const [search, setSearch] = useState("")
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data, isLoading, isError, error } = useGetBrandsQuery(
    {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
      search: search || undefined,
    },
    { skip: !canRead }
  )

  const brands: Brand[] = data?.data ?? []

  if (!canRead) return <PermissionDenied />

  return (
    <PageContainer
      title="Brands"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Brands" },
      ]}
      pageHeaderAction={
        canCreate ? (
          <CreateBrandDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        ) : null
      }
    >
      <DataTable
        title="Brands"
        description="List of all brands in the system."
        data={brands}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={paginationState}
        onPaginationChange={setPaginationState}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search brands...",
        }}
        manualPagination
        columnVisibility
        totalRows={data?.meta.total ?? 0}
      />
    </PageContainer>
  )
}
