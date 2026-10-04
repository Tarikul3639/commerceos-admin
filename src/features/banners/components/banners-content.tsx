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
import { useGetBannersQuery } from "../api/banners.api"
import { BannerPosition, BannerType } from "../types/banners.types"
import { columns } from "./banners-columns"
import { CreateBannerDialog } from "./create-banner-dialog"

export function BannersContent() {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [position, setPosition] = useState("all")
  const [status, setStatus] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()
  const { data, isLoading, isFetching, isError, error } = useGetBannersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    type: type === "all" ? undefined : (type as BannerType),
    position: position === "all" ? undefined : (position as BannerPosition),
    isActive: status === "all" ? undefined : status === "active",
  })

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.BANNER_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Banners"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Banners" },
      ]}
      pageHeaderAction={
        permission.has(Permission.BANNER_CREATE) && (
          <CreateBannerDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
        )
      }
    >
      <DataTable
        title="Banners"
        description="Manage storefront banner images and placement."
        data={data?.data ?? []}
        columns={columns}
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
          placeholder: "Search banners...",
        }}
        toolbarFilters={
          <div className="flex flex-wrap gap-2">
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.values(BannerType).map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatEnumLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={position}
              onValueChange={(value) => {
                setPosition(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="All positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {Object.values(BannerPosition).map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatEnumLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        columnVisibility
        emptyText="No banners found."
      />
    </PageContainer>
  )
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}
