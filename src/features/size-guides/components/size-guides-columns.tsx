"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { getErrorMessage } from "@/lib/utils/error"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { useDeleteSizeGuideMutation } from "../api/size-guides.api"
import type { SizeGuide } from "../types/size-guide.types"
import { ViewSizeGuideDialog } from "./view-size-guide-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, SizeGuide>()

/** Renders the clickable size guide name and its details dialog. */
function SizeGuideNameCell({ sizeGuide }: { sizeGuide: SizeGuide }) {
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <>
      <div className="min-w-0">
        <button
          type="button"
          className="text-left font-medium transition-colors hover:text-primary"
          onClick={() => setViewOpen(true)}
        >
          {sizeGuide.name}
        </button>
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

/** Renders row actions for viewing, updating, and deleting a size guide. */
function SizeGuideActionsCell({ sizeGuide }: { sizeGuide: SizeGuide }) {
  const router = useRouter()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { has } = usePermission()
  const canUpdate = has(Permission.PRODUCT_UPDATE)
  const canDelete = has(Permission.PRODUCT_DELETE)
  const [deleteSizeGuide, { isLoading }] = useDeleteSizeGuideMutation()

  /** Deletes the current size guide after confirmation. */
  const handleDelete = async () => {
    if (!canDelete) return

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
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <Info className="size-4" />
              Details
            </DropdownMenuItem>
            {canUpdate && (
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/size-guides/${sizeGuide.id}/update`)
                }
              >
                <SquarePen className="size-4" />
                Update
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewSizeGuideDialog
        sizeGuide={sizeGuide}
        open={viewOpen}
        onOpenChange={setViewOpen}
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

/** Defines the size guide table columns. */
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
