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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"
import { useDeleteSupplierMutation } from "../api/supplier.api"
import type { Supplier } from "../types/supplier.types"
import { SupplierDialog } from "./supplier-dialog"
import { SupplierDetailsDialog } from "./supplier-details-dialog"

const helper = createColumnHelper<DataTableFeatures, Supplier>()
export const columns = helper.columns([
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium">{row.original.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {row.original.contactPerson || row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email || "—"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.phone || "—"}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
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
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => {
      const supplier = row.original
      const [details, setDetails] = useState(false)
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
      const [deleting, setDeleting] = useState(false)
      const [deleteSupplier, state] = useDeleteSupplierMutation()
      const permission = usePermission()
      const remove = async () => {
        try {
          await deleteSupplier(supplier.id).unwrap()
          toast.success("Supplier deleted successfully")
          setDeleting(false)
        } catch (error) {
          toast.error("Failed to delete supplier", {
            description:
              (error as { data?: { message?: string } })?.data?.message ??
              "Please try again.",
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

            <DropdownMenuContent align="end" className="p-1">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setDetails(true)}>
                  <Info className="size-4" />
                  Details
                </DropdownMenuItem>

                {permission.has(Permission.SUPPLIER_UPDATE) && (
                  <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                    <SquarePen className="size-4" />
                    Update
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              {permission.has(Permission.SUPPLIER_DELETE) && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleting(true)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <SupplierDetailsDialog
            id={supplier.id}
            open={details}
            onOpenChange={setDetails}
          />
          {permission.has(Permission.SUPPLIER_UPDATE) && (
            <SupplierDialog
              supplier={supplier}
              open={isUpdateDialogOpen}
              onOpenChange={setIsUpdateDialogOpen}
            />
          )}
          <ConfirmDialog
            open={deleting}
            onOpenChange={setDeleting}
            title="Delete supplier"
            description={
              <>
                Remove <strong>{supplier.name}</strong>? It will no longer
                appear in the active supplier list.
              </>
            }
            confirmLabel={state.isLoading ? "Deleting..." : "Delete"}
            onConfirm={remove}
          />
        </>
      )
    },
  },
])
