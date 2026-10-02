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

import { Badge } from "@/components/ui/badge"
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

export const columnHelper = createColumnHelper<DataTableFeatures, Discount>()

export const columns = columnHelper.columns([
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const discount = row.original

      return (
        <div className="flex flex-col">
          <span className="font-medium">{discount.name}</span>
          <Link
            href={`/dashboard/discounts/${discount.id}`}
            className="text-xs text-muted-foreground hover:underline"
          >
            {discount.id}
          </Link>
        </div>
      )
    },
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
  },

  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const discount = row.original

      return (
        <span className="font-medium">
          {discount.type === "PERCENTAGE"
            ? `${discount.value}%`
            : discount.value}
        </span>
      )
    },
  },

  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          })
        : "—",
  },

  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) =>
      row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          })
        : "—",
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive

      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 size-4" />
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
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/discounts/${discount.id}`}>
                    <Info />
                    Details
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                  <SquarePen className="size-4" />
                  Update
                </DropdownMenuItem>
              </DropdownMenuGroup>

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
            </DropdownMenuContent>
          </DropdownMenu>

          <UpdateDiscountDialog
            discount={discount}
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          />

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete Discount"
            description={
              <>
                Are you sure you want to delete <strong>{discount.name}</strong>
                ? This action cannot be undone.
              </>
            }
            confirmLabel={isDeleting ? "Deleting..." : "Delete"}
            cancelLabel="Cancel"
            onConfirm={handleDelete}
          />
        </>
      )
    },
  },
])
