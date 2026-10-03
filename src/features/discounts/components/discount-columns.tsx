"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Info,
  MoreHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { getErrorMessage } from "@/lib/utils/error"
import { useDeleteDiscountMutation } from "../api/discount.api"
import { UpdateDiscountDialog } from "./update-discount-dialog"
import type { Discount } from "../types/discount.types"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

export const columnHelper = createColumnHelper<DataTableFeatures, Discount>()

export const columns = columnHelper.columns([
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.product.image && (
          <img
            src={row.original.product.image}
            alt=""
            className="h-9 w-9 rounded object-cover"
          />
        )}
        <div>
          <div className="font-medium">{row.original.product.name}</div>
          <div className="text-xs text-muted-foreground">
            SKU: {row.original.product.sku}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.value}%</span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) =>
      row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "createdBy.name",
    header: "Created by",
    cell: ({ row }) => row.original.createdBy.name,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => {
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
      const permission = usePermission()
      const canReadProduct = permission.has(Permission.PRODUCT_READ)
      const canUpdate = permission.has(Permission.DISCOUNT_UPDATE)
      const canDelete = permission.has(Permission.DISCOUNT_DELETE)
      const [deleteDiscount, { isLoading: isDeleting }] =
        useDeleteDiscountMutation()
      const discount = row.original
      const handleDelete = async () => {
        try {
          await deleteDiscount(discount.id).unwrap()
          toast.success("Discount deleted successfully")
          setIsDeleteDialogOpen(false)
        } catch (error) {
          toast.error("Failed to delete discount", {
            description: getErrorMessage(error) || "Something went wrong.",
          })
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canReadProduct && (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${discount.productId}`}>
                      <Info />
                      Details
                    </Link>
                  </DropdownMenuItem>
                )}
                {canUpdate && (
                  <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                    <SquarePen className="size-4" />
                    Update
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Danger</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {canUpdate && (
            <UpdateDiscountDialog
              discount={discount}
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
            />
          )}
          {canDelete && (
            <ConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              title="Delete discount"
              description={
                <>
                  Delete the discount on{" "}
                  <strong>{discount.product.name}</strong>? This action cannot
                  be undone.
                </>
              }
              confirmLabel={isDeleting ? "Deleting..." : "Delete"}
              cancelLabel="Cancel"
              onConfirm={handleDelete}
            />
          )}
        </>
      )
    },
  },
])
