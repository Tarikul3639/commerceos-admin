"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"

import { PageContainer } from "@/components/layout/page-container"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetProductsQuery } from "../../api/product.api"
import { columns } from "./products-columns"

export function ProductsContent() {
  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState<boolean | undefined>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isError, error } = useGetProductsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    isActive,
  })

  const handleActiveFilter = (value: string) => {
    setIsActive(value === "all" ? undefined : value === "active")
  }

  return (
    <PageContainer
      title="Products"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products" },
      ]}
      pageHeaderAction={
        <Button asChild>
          <Link href="/dashboard/products/create">
            <Plus />
            Create
          </Link>
        </Button>
      }
    >
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search products...",
        }}
        toolbarFilters={
          <Select
            value={
              isActive === undefined ? "all" : isActive ? "active" : "inactive"
            }
            onValueChange={handleActiveFilter}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="p-1">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total ?? 0}
        columnVisibility
        initialColumnVisibility={{
          description: false,
          createdAt: false,
          updatedAt: false,
        }}

        emptyText="No products found."
      />
    </PageContainer>
  )
}
