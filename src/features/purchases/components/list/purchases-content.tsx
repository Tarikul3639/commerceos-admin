"use client"

import { useState } from "react"
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
import { useGetSuppliersQuery } from "@/features/suppliers/api/supplier.api"
import { useGetPurchasesQuery } from "../../api/purchase.api"
import type { PurchaseStatus } from "../../types/purchase.types"
import { columns } from "./purchases-columns"
import { Plus } from "lucide-react"
import Link from "next/link"

export function PurchasesContent() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [supplierId, setSupplierId] = useState("all")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()
  const { data: suppliers } = useGetSuppliersQuery({ limit: 100 })
  const { data, isLoading, isFetching, isError, error } = useGetPurchasesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: status === "all" ? undefined : (status as PurchaseStatus),
    supplierId: supplierId === "all" ? undefined : supplierId,
  })
  const resetPage = () => setPagination((value) => ({ ...value, pageIndex: 0 }))
  return (
    <PageContainer
      access={permission.has(Permission.PURCHASE_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Purchases"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchases" },
      ]}
      pageHeaderAction={
        permission.has(Permission.PURCHASE_CREATE) && (
          <Button asChild variant="default" size="sm">
            <Link href="/dashboard/purchases/create">
              <Plus />
              Create
            </Link>
          </Button>
        )
      }
    >
      <DataTable
        title="Purchases"
        description="Track supplier purchases and received stock."
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
            resetPage()
          },
          placeholder: "Search invoices or suppliers...",
        }}
        toolbarFilters={
          <div className="flex flex-wrap gap-2">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RECEIVED">Received</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={supplierId}
              onValueChange={(value) => {
                setSupplierId(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All suppliers</SelectItem>
                {suppliers?.data.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        manualPagination
        columnVisibility
        totalRows={data?.meta.total ?? 0}
      />
    </PageContainer>
  )
}
