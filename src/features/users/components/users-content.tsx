"use client"

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"

import { useGetUsersQuery } from "../api/user.api"
import type {
  UserQueryParams,
  UserStatus,
  UserSortBy,
  SortOrder,
} from "../types/user.types"

import { CreateUserDialog } from "./create-user-dialog"
import { columns } from "./user-columns"

export function UsersContent() {
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

    ...(query.search && {
      search: query.search,
    }),

    ...(query.status && {
      status: query.status as UserStatus,
    }),

    ...(query.sortBy && {
      sortBy: query.sortBy as UserSortBy,
    }),

    ...(query.sortOrder && {
      sortOrder: query.sortOrder as SortOrder,
    }),
  }

  const { data, isLoading, isFetching } = useGetUsersQuery(params)

  const users = data?.data ?? []
  const meta = data?.meta

  const pagination: PaginationState = {
    pageIndex: query.page - 1,
    pageSize: query.limit,
  }

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState)
  ) => {
    const nextPagination =
      typeof updater === "function" ? updater(pagination) : updater

    setQuery({
      page: nextPagination.pageIndex + 1,
      limit: nextPagination.pageSize,
    })
  }

  return (
    <PageContainer
      title="Users"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Users" },
      ]}
      pageHeaderAction={<CreateUserDialog />}
    >
      <DataTable
        columns={columns}
        data={users}
        title="Users"
        description="List of all users"
        isLoading={isLoading}
        isFetching={isFetching && !isLoading}
        columnVisibility
        initialColumnVisibility={{
          last_login: false,
          created_at: false,
        }}
        emptyText="No users found"
        manualPagination
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        totalRows={meta?.total ?? 0}
        search={{
          value: query.search,
          onChange: (value) => setQuery({ search: value, page: 1 }),
          placeholder: "Search users...",
        }}
      />
    </PageContainer>
  )
}
