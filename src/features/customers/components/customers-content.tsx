"use client"

import { useState } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

import type { PaginationState } from "@tanstack/react-table"

import { PageContainer } from "@/components/layout/page-container"
import { DataTable } from "@/components/data-table"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"

import { customerColumns } from "./customers-columns"
import { CreateCustomerDialog } from "./create-customer-dialog"

import { useGetCustomersQuery } from "../api/customers.api"
import type {
  CustomerSortOrder,
  CustomerSortBy,
} from "../types/customers.types"

export function CustomersContent() {
  const { has } = usePermission()
  const canRead = has(Permission.CUSTOMER_READ)
  const canCreate = has(Permission.CUSTOMER_CREATE)
  const [isOpen, setIsOpen] = useState(false)

  // Keep pagination, search, and sorting state in the URL.
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),

    sortBy: parseAsStringEnum<CustomerSortBy>([
      "name",
      "email",
      "createdAt",
      "updatedAt",
    ]),

    sortOrder: parseAsStringEnum<CustomerSortOrder>(["asc", "desc"]),
  })

  // Fetch customers using the current URL query parameters.
  const { data, isLoading, isFetching } = useGetCustomersQuery(
    {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      sortBy: params.sortBy ?? undefined,
      sortOrder: params.sortOrder ?? undefined,
    },
    { skip: !canRead }
  )

  const customers = data?.data ?? []
  const meta = data?.meta

  // Convert URL pagination values to TanStack Table pagination state.
  const pagination: PaginationState = {
    pageIndex: params.page - 1,
    pageSize: params.limit,
  }

  // Update URL parameters when the table pagination changes.
  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState)
  ) => {
    const nextPagination =
      typeof updater === "function" ? updater(pagination) : updater

    setParams({
      page: nextPagination.pageIndex + 1,
      limit: nextPagination.pageSize,
    })
  }

  if (!canRead) return <PermissionDenied />

  return (
    <PageContainer
      title="Customers"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Customers" },
      ]}
      pageHeaderAction={
        canCreate ? (
          <CreateCustomerDialog open={isOpen} onOpenChange={setIsOpen} />
        ) : null
      }
    >
      <DataTable
        title="Customers"
        description="List of all customers in the system."
        columns={customerColumns}
        data={customers}
        isLoading={isLoading}
        isFetching={isFetching && !isLoading}
        columnVisibility
        initialColumnVisibility={{
          address: false,
          phone: false,
        }}

        // Enable server-side pagination.
        manualPagination
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        totalRows={meta?.total ?? 0}

        // Keep search value synchronized with the URL.
        search={{
          value: params.search,
          onChange: (value) =>
            setParams({
              search: value,
              page: 1,
            }),
          placeholder: "Search customers...",
        }}
      />
    </PageContainer>
  )
}
