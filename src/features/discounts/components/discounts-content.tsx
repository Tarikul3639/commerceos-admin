"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Button } from "@/components/ui/button"
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
import { getErrorMessage } from "@/lib/utils/error"
import {
  useDeleteDiscountMutation,
  useGetDiscountsQuery,
} from "../api/discounts.api"
import type { Discount } from "../types/discount.types"
import { DiscountFormDialog } from "./discount-form-dialog"
import { getDiscountColumns } from "./discounts-columns"

export function DiscountsContent() {
  const permission = usePermission()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState<Discount | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null)
  const [deleteDiscount, deleteState] = useDeleteDiscountMutation()
  const { data, isLoading, isFetching, isError, error } = useGetDiscountsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    isActive: status === "all" ? undefined : status === "active",
  })

  const openCreate = () => {
    setSelected(null)
    setFormOpen(true)
  }
  const openEdit = (discount: Discount) => {
    setSelected(discount)
    setFormOpen(true)
  }
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteDiscount(deleteTarget.id).unwrap()
      toast.success("Discount deleted")
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Unable to delete discount")
    }
  }

  return (
    <PageContainer
      access={permission.has(Permission.DISCOUNT_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Discounts"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discounts" },
      ]}
      pageHeaderAction={
        permission.has(Permission.DISCOUNT_CREATE) && (
          <Button onClick={openCreate}>
            <Plus /> Create discount
          </Button>
        )
      }
    >
      <DataTable
        title="Coupon codes"
        description="Manage percentage and fixed-amount coupon codes, validity dates and order thresholds."
        data={data?.data ?? []}
        columns={getDiscountColumns(openEdit, setDeleteTarget)}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPagination((p) => ({ ...p, pageIndex: 0 }))
          },
          placeholder: "Search coupon codes...",
        }}
        toolbarFilters={
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
        columnVisibility
        emptyText="No coupon codes found."
      />
      <DiscountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        discount={selected}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete coupon code"
        description={
          <>
            Delete <strong>{deleteTarget?.code}</strong>? This cannot be undone.
          </>
        }
        confirmLabel={deleteState.isLoading ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
      />
    </PageContainer>
  )
}
