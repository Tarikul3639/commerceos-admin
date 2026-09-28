"use client"

import { useState } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

import { PageContainer } from "@/components/layout/page-container"
import { CreateCategoryDialog } from "./create-category-dialog"
import { DataTable } from "@/components/data-table"
import { PaginationState } from "@tanstack/react-table"
import { columns } from "./categories-columns"
import { useGetCategoriesQuery } from "../api/categories.api"

import { categories } from "../data/categories.data"

export function CategoriesContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
  })

  // Convert URL pagination values to TanStack Table pagination state.
  const pagination: PaginationState = {
    pageIndex: params.page - 1,
    pageSize: params.limit,
  }

  const { data, isLoading, isFetching } = useGetCategoriesQuery(params)
  const categoriesData = data?.data || categories
  const paginatedMeta = data?.meta || { total: 0, page: 1, limit: 10 }

  return (
    <PageContainer
      pageTitle="Categories"
      pageDescription="Manage your product categories."
      pageHeaderAction={
        <CreateCategoryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      }
    >
      <DataTable
        title="Categories"
        description="Manage your product categories."
        columns={columns}
        data={categoriesData}
        isLoading={isLoading}
        isFetching={isFetching}
        columnVisibility={true}

        // Pass the current search state and a handler to update it.
        search={{
          value: params.search,
          onChange: (search) => {
            setParams({
              search,
              page: 1, // Reset to first page when search changes
            })
          },
        }}

        // Pass the current pagination state and a handler to update it.
        pagination={pagination}
        onPaginationChange={(
          updater: PaginationState | ((old: PaginationState) => PaginationState)
        ) => {
          const newPagination =
            typeof updater === "function" ? updater(pagination) : updater

          setParams({
            page: newPagination.pageIndex + 1,
            limit: newPagination.pageSize,
          })
        }}
        totalRows={paginatedMeta.total}
      />
    </PageContainer>
  )
}
