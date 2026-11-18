"use client"

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { useGetUsersQuery } from "@/features/users/api/user.api"
import type {
  UserQueryParams,
  UserSortBy,
  SortOrder,
  UserStatus,
} from "@/features/users/types/user.types"

import { CreateEmployeeDialog } from "./create-employee-dialog"
import { columns } from "@/features/users/components/user-columns"

export function EmployeesContent() {
  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    status: parseAsString,
    sortBy: parseAsString,
    sortOrder: parseAsString,
  })

  const params: UserQueryParams = {
    page: query.page,
    limit: query.limit,
    staffOnly: true,
    ...(query.search ? { search: query.search } : {}),
    ...(query.status ? { status: query.status as UserStatus } : {}),
    ...(query.sortBy ? { sortBy: query.sortBy as UserSortBy } : {}),
    ...(query.sortOrder ? { sortOrder: query.sortOrder as SortOrder } : {}),
  }

  const { data, isLoading, isFetching } = useGetUsersQuery(params)
  const employees = data?.data ?? []
  const meta = data?.meta
  const pagination: PaginationState = {
    pageIndex: query.page - 1,
    pageSize: query.limit,
  }

  const handlePaginationChange = (
    updater: PaginationState | ((previous: PaginationState) => PaginationState)
  ) => {
    const next = typeof updater === "function" ? updater(pagination) : updater
    setQuery({ page: next.pageIndex + 1, limit: next.pageSize })
  }

  return (
    <PageContainer
      title="Employees"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Employees" },
      ]}
      pageHeaderAction={<CreateEmployeeDialog />}
    >
      <DataTable
        columns={columns}
        data={employees}
        title="Employees"
        description="Managers and employees with access to the CommerceOS workspace"
        isLoading={isLoading}
        isFetching={isFetching && !isLoading}
        columnVisibility
        initialColumnVisibility={{ last_login: false, created_at: false }}
        emptyText="No employees found"
        manualPagination
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        totalRows={meta?.total ?? 0}
        search={{
          value: query.search,
          onChange: (value) => setQuery({ search: value, page: 1 }),
          placeholder: "Search employees...",
        }}
      />
    </PageContainer>
  )
}
