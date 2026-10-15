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

import { Button } from "@/components/ui/button"
import type { DataTableFeatures } from "@/components/data-table"
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

import { useDeleteSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuide } from "../types/size-guide.types"
import { UpdateSizeGuideDialog } from "./update-size-guide-dialog"
import { ViewSizeGuideDialog } from "./view-size-guide-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, SizeGuide>()

// Column definitions for the size guides table
function SizeGuideNameCell({ sizeGuide }: { sizeGuide: SizeGuide }) {
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <>
      <div className="min-w-0">
        <div
          className="cursor-pointer font-medium transition-colors hover:text-primary"
          onClick={() => setViewOpen(true)}
        >
          {sizeGuide.name}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {sizeGuide.id}
        </div>
      </div>

      <ViewSizeGuideDialog
        sizeGuide={sizeGuide}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
    </>
  )
}

function SizeGuideActionsCell({ sizeGuide }: { sizeGuide: SizeGuide }) {
  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [deleteSizeGuide, { isLoading }] = useDeleteSizeGuideMutation()

  const handleDelete = async () => {
    try {
      await deleteSizeGuide(sizeGuide.id).unwrap()

      toast.success("Size guide deleted successfully")
      setDeleteOpen(false)
    } catch (error) {
      toast.error("Failed to delete size guide", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            aria-label={`Actions for ${sizeGuide.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <Info className="size-4" />
              Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
              <SquarePen className="size-4" />
              Update
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewSizeGuideDialog
        sizeGuide={sizeGuide}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <UpdateSizeGuideDialog
        sizeGuide={sizeGuide}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Size Guide"
        description={
          <>
            Are you sure you want to delete <strong>{sizeGuide.name}</strong>?
            This action cannot be undone.
          </>
        }
        confirmLabel={isLoading ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />
    </>
  )
}

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
    // Use a custom cell component for the name column to safely use hooks or state
    cell: ({ row }) => <SizeGuideNameCell sizeGuide={row.original} />,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <span className="uppercase">{row.original.unit}</span>,
  },
  {
    accessorKey: "columns",
    header: "Measurements",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.columns.length} columns
      </span>
    ),
  },
  {
    accessorKey: "rows",
    header: "Sizes",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.rows.length} sizes
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <SizeGuideActionsCell sizeGuide={row.original} />,
  },
])
