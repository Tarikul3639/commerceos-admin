"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { useGetPurchaseReturnsQuery } from "../api/purchase-return.api"
import type { PurchaseReturnStatus } from "../types/purchase-return.types"
import { purchaseReturnColumns } from "./purchase-return-columns"

export function PurchaseReturnListContent() {
  const permission = usePermission()
  const [status, setStatus] = useState("all")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isLoading, isFetching, isError, error } =
    useGetPurchaseReturnsQuery({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      status: status === "all" ? undefined : (status as PurchaseReturnStatus),
    })
  return (
    <PageContainer
      access={permission.has(Permission.PURCHASE_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Purchase Returns"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchase Returns" },
      ]}
      pageHeaderAction={
        permission.has(Permission.PURCHASE_CREATE) && (
          <Button asChild size="sm">
            <Link href="/dashboard/purchase-returns/create">
              <Plus />
              Create return
            </Link>
          </Button>
        )
      }
    >
      <DataTable
        title="Purchase returns"
        description="Review returns created against received purchases."
        data={data?.data ?? []}
        columns={purchaseReturnColumns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        pagination={pagination}
        onPaginationChange={setPagination}
        toolbarFilters={
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPagination((current) => ({ ...current, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        }
        manualPagination
        columnVisibility
        totalRows={data?.meta.total ?? 0}
      />
    </PageContainer>
  )
}
