"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { useGetSuppliersQuery } from "../api/supplier.api"
import { columns } from "./suppliers-columns"
import { SupplierDialog } from "./supplier-dialog"

export function SuppliersContent() {
  const [search, setSearch] = useState("")
  const [active, setActive] = useState("all")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const permission = usePermission()
  const { data, isLoading, isFetching, isError, error } = useGetSuppliersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    isActive: active === "all" ? undefined : active === "active",
  })
  return (
    <PageContainer
      access={permission.has(Permission.SUPPLIER_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Suppliers"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Suppliers" },
      ]}
      pageHeaderAction={
        permission.has(Permission.SUPPLIER_CREATE) && (
          <Button
            onClick={() => setCreateOpen(true)}
            disabled={isLoading || isFetching}
          >
            <Plus />
            Create
          </Button>
        )
      }
    >
      <DataTable
        title="Suppliers"
        description="Manage supplier contact information."
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        pagination={pagination}
        onPaginationChange={setPagination}
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPagination((state) => ({ ...state, pageIndex: 0 }))
          },
          placeholder: "Search suppliers...",
        }}
        toolbarFilters={
          <Select
            value={active}
            onValueChange={(value) => {
              setActive(value)
              setPagination((state) => ({ ...state, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        }
        manualPagination
        columnVisibility
        totalRows={data?.meta.total ?? 0}
      />
      <SupplierDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  )
}
