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

import { useGetOrdersQuery } from "../api/orders.api"
import type { OrderStatus, PaymentStatus } from "../types/order.types"
import { orderColumns } from "./orders-columns"

export function OrdersContent() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "ALL">(
    "ALL"
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()

  const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
    paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
  })

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.ORDER_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Orders"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Orders" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review customer orders, inspect line items, and manage fulfilment
          status.
        </p>
      }
    >
      <DataTable
        title="Customer orders"
        description="Orders are sorted by newest first."
        columns={orderColumns}
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
          placeholder: "Search invoice or customer...",
        }}
        toolbarFilters={
          <>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as OrderStatus | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={paymentStatus}
              onValueChange={(value) => {
                setPaymentStatus(value as PaymentStatus | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-[145px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No orders match the selected filters."
      />
    </PageContainer>
  )
}
