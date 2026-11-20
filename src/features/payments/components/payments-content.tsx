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

import { useGetPaymentsQuery } from "../api/payments.api"
import type {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "../types/payment.types"
import { paymentColumns } from "./payments-columns"

export function PaymentsContent() {
  const [search, setSearch] = useState("")
  const [method, setMethod] = useState<PaymentMethod | "ALL">("ALL")
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL")
  const [type, setType] = useState<PaymentType | "ALL">("ALL")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()

  const { data, isLoading, isFetching, isError, error } = useGetPaymentsQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
      method: method === "ALL" ? undefined : method,
      status: status === "ALL" ? undefined : status,
      type: type === "ALL" ? undefined : type,
    },
    { skip: !permission.has(Permission.ORDER_READ) }
  )

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.ORDER_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Payments"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payments" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review payment and refund records. Gateway transactions are shown as
          recorded by the backend; this screen does not verify or initiate
          gateway payments.
        </p>
      }
    >
      <DataTable
        title="Payment transactions"
        description="Newest transactions first. Search by invoice, order ID or transaction reference."
        columns={paymentColumns}
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
          placeholder: "Search invoice, order or transaction...",
        }}
        toolbarFilters={
          <>
            <Select
              value={method}
              onValueChange={(value) => {
                setMethod(value as PaymentMethod | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-[135px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All methods</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="BKASH">bKash</SelectItem>
                <SelectItem value="NAGAD">Nagad</SelectItem>
                <SelectItem value="ROCKET">Rocket</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as PaymentStatus | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value as PaymentType | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-[125px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                <SelectItem value="PAYMENT">Payments</SelectItem>
                <SelectItem value="REFUND">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        emptyText="No transactions match the selected filters."
      />
    </PageContainer>
  )
}
