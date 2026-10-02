"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Info,
  MoreHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { ViewCategoryDialog } from "./view-category-dialog"
import { UpdateCategoryDialog } from "./update-category-dialog"
import { useDeleteCategoryMutation } from "../api/categories.api"
import type { Category } from "../types/categories.types"
import { getErrorMessage } from "@/lib/utils/error"

export const columnHelper = createColumnHelper<DataTableFeatures, Category>()

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
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },

  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.slug}</span>
    ),
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-muted-foreground">
        {row.original.description || "—"}
      </div>
    ),
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
      const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

      const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation()

      const category = row.original

      const handleDelete = async () => {
        try {
          await deleteCategory(category.id).unwrap()

          toast.success("Category deleted successfully")
          setIsDeleteDialogOpen(false)
        } catch (error) {
          toast.error("Failed to delete category", {
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
                <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
                  <Info className="size-4" />
                  Details
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

          <ViewCategoryDialog
            category={category}
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
          />

          <UpdateCategoryDialog
            category={category}
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          />

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete Category"
            description={
              <>
                Are you sure you want to delete <strong>{category.name}</strong>
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
