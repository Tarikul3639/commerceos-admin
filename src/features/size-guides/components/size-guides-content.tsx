"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { Button } from "@/components/ui/button"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"

import { useGetSizeGuidesQuery } from "../api/size-guides.api"
import type { SizeGuide } from "../types/size-guide.types"
import { columns } from "./size-guides-columns"

/** Displays and manages the size guide collection. */
export function SizeGuidesContent() {
  const router = useRouter()
  const { has } = usePermission()
  const canRead = has(Permission.PRODUCT_READ)
  const canCreate = has(Permission.PRODUCT_CREATE)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isLoading, isError, error } = useGetSizeGuidesQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
    },
    { skip: !canRead }
  )

  if (!canRead) return <PermissionDenied />

  return (
    <PageContainer
      title="Size Guides"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Size Guides" },
      ]}
      pageHeaderAction={
        canCreate ? (
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/size-guides/create")}
          >
            Create Size Guide
          </Button>
        ) : null
      }
    >
      <DataTable
        title="Size Guides"
        description="Manage measurement tables used by your products."
        data={(data?.data ?? []) as SizeGuide[]}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={pagination}
        onPaginationChange={setPagination}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search size guides...",
        }}
        manualPagination
        columnVisibility
        totalRows={data?.meta.total ?? 0}
      />
    </PageContainer>
  )
}
