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
import type { ProductStatus } from "../../types/product.types"
import { columns } from "./products-columns"

export function ProductsContent() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProductStatus | undefined>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isError, error } = useGetProductsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status,
  })

  const handleStatusFilter = (value: string) => {
    setStatus(value === "all" ? undefined : (value as ProductStatus))
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }))
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
          onChange: (value) => {
            setSearch(value)
            setPagination((previous) => ({
              ...previous,
              pageIndex: 0,
            }))
          },
          placeholder: "Search products...",
        }}
        toolbarFilters={
          <Select value={status ?? "all"} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="p-1">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PROPOSED">Proposed</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
