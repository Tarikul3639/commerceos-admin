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

import { useGetOrderReturnsQuery } from "../api/returns.api"
import type { OrderReturnStatus } from "../types/return.types"
import { returnColumns } from "./returns-columns"

export function ReturnsContent() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OrderReturnStatus | "ALL">("ALL")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()

  const { data, isLoading, isFetching, isError, error } =
    useGetOrderReturnsQuery({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
      status: status === "ALL" ? undefined : status,
    })

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.ORDER_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Order Returns"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Order Returns" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review return requests, approve or reject pending requests, and
          complete approved returns after the goods have been received and
          inspected.
        </p>
      }
    >
      <DataTable
        title="Return requests"
        description="Newest return requests first."
        columns={returnColumns}
        data={data?.data ?? []}
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
          placeholder: "Search return ID, invoice or customer...",
        }}
        toolbarFilters={
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as OrderReturnStatus | "ALL")
              resetPage()
            }}
          >
            <SelectTrigger className="w-[155px]">
              <SelectValue placeholder="Return status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PARTIALLY_PAID">Partially paid</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No return requests match the selected filters."
      />
    </PageContainer>
  )
}
